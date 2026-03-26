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
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username == req.Username && u.IsActive);

        if (user is null || user.PasswordHash != req.Password)
            return Unauthorized(new { message = "Invalid username or password" });

        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == user.Id);
        var token = jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.Username, user.FullName,
            user.Role.RoleName.ToLower(), user.Email, user.Phone, user.AvatarUrl, customer?.Address));
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
            PasswordHash = req.Password, // plain text for dev
            FullName = req.FullName,
            Email = req.Email,
            Phone = req.Phone,
            RoleId = customerRole.Id,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        // Create customer record
        db.Customers.Add(new Customer { UserId = user.Id });
        await db.SaveChangesAsync();

        // Reload with role
        await db.Entry(user).Reference(u => u.Role).LoadAsync();
        var token = jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.Username, user.FullName,
            user.Role.RoleName.ToLower(), user.Email, user.Phone, user.AvatarUrl));
    }

    // TEMP: remove after use
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
            user.PasswordHash = req.NewPassword; // plain text for dev
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
