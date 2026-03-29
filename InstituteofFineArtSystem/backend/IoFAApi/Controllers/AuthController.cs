using IoFAApi.Data;
using IoFAApi.DTOs;
using IoFAApi.Models;
using IoFAApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IoFAApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, JwtService jwt) : ControllerBase
{
    private string GenerateRefreshToken() =>
        Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(64));

    private async Task<string> CreateRefreshToken(int userId)
    {
        // Revoke old tokens for this user
        await db.RefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.IsRevoked, true));

        var token = new RefreshToken
        {
            UserId = userId,
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(3),
        };
        db.RefreshTokens.Add(token);
        await db.SaveChangesAsync();
        return token.Token;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username == req.Username && u.IsActive);

        if (user is null || user.PasswordHash != req.Password)
            return Unauthorized(new { message = "Invalid username or password" });

        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == user.Id);
        var accessToken = jwt.GenerateToken(user);
        var refreshToken = await CreateRefreshToken(user.Id);

        return Ok(new AuthResponse(accessToken, user.Id, user.Username, user.FullName,
            user.Role.RoleName.ToLower(), user.Email, user.Phone, user.AvatarUrl,
            customer?.Address, refreshToken));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Username == req.Username))
            return BadRequest(new { message = "Username already taken" });

        var customerRole = await db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
        if (customerRole is null) return StatusCode(500, "Customer role not found");

        var user = new User
        {
            Username = req.Username,
            PasswordHash = req.Password,
            FullName = req.FullName,
            Email = req.Email,
            Phone = req.Phone,
            RoleId = customerRole.Id,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.Customers.Add(new Customer { UserId = user.Id });
        await db.SaveChangesAsync();

        await db.Entry(user).Reference(u => u.Role).LoadAsync();
        var accessToken = jwt.GenerateToken(user);
        var refreshToken = await CreateRefreshToken(user.Id);

        return Ok(new AuthResponse(accessToken, user.Id, user.Username, user.FullName,
            user.Role.RoleName.ToLower(), user.Email, user.Phone, user.AvatarUrl,
            null, refreshToken));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest req)
    {
        var stored = await db.RefreshTokens
            .Include(r => r.User).ThenInclude(u => u.Role)
            .FirstOrDefaultAsync(r => r.Token == req.RefreshToken && !r.IsRevoked);

        if (stored is null || stored.ExpiresAt < DateTimeOffset.UtcNow)
            return Unauthorized(new { message = "Invalid or expired refresh token" });

        if (!stored.User.IsActive)
            return Unauthorized(new { message = "Account is inactive" });

        // Rotate refresh token
        stored.IsRevoked = true;
        var newRefreshToken = new RefreshToken
        {
            UserId = stored.UserId,
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(3),
        };
        db.RefreshTokens.Add(newRefreshToken);
        await db.SaveChangesAsync();

        var accessToken = jwt.GenerateToken(stored.User);
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == stored.UserId);

        return Ok(new AuthResponse(accessToken, stored.User.Id, stored.User.Username,
            stored.User.FullName, stored.User.Role.RoleName.ToLower(),
            stored.User.Email, stored.User.Phone, stored.User.AvatarUrl,
            customer?.Address, newRefreshToken.Token));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest req)
    {
        await db.RefreshTokens
            .Where(r => r.Token == req.RefreshToken)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.IsRevoked, true));
        return Ok(new { message = "Logged out" });
    }

    [HttpGet("genhash/{password}")]
    public IActionResult GenHash(string password) =>
        Ok(new { hash = BCrypt.Net.BCrypt.HashPassword(password) });

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var user = await db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null) return NotFound();
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        return Ok(new AuthResponse("", user.Id, user.Username, user.FullName,
            user.Role.RoleName.ToLower(), user.Email, user.Phone, user.AvatarUrl, customer?.Address));
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var user = await db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null) return NotFound();

        if (!string.IsNullOrEmpty(req.CurrentPassword) && !string.IsNullOrEmpty(req.NewPassword))
        {
            if (!BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash))
                return BadRequest(new { message = "Current password is incorrect" });
            user.PasswordHash = req.NewPassword;
        }

        user.FullName = req.FullName;
        user.Email = req.Email;
        user.Phone = req.Phone;
        if (req.AvatarUrl is not null) user.AvatarUrl = req.AvatarUrl;

        await db.SaveChangesAsync();
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        var token = jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.Username, user.FullName,
            user.Role.RoleName.ToLower(), user.Email, user.Phone, user.AvatarUrl, customer?.Address));
    }
}
