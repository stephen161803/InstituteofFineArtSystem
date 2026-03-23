using IoFAApi.Data;
using IoFAApi.DTOs;
using IoFAApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IoFAApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController(AppDbContext db) : ControllerBase
{
    // ── STAFF ──────────────────────────────────────────────────────────────

    [HttpGet("staff")]
    public async Task<IActionResult> GetStaff()
    {
        var list = await db.Staffs
            .Include(s => s.User)
            .Select(s => new StaffDto(
                s.UserId, s.User.FullName, s.User.Email, s.User.Phone,
                s.DateJoined.HasValue ? s.DateJoined.Value.ToString("yyyy-MM-dd") : null,
                s.SubjectHandled, s.Remarks))
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("staff")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Username == req.Username))
            return BadRequest(new { message = "Username already taken" });

        var staffRole = await db.Roles.FirstAsync(r => r.RoleName == "Staff");
        var user = new User
        {
            Username = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            FullName = req.FullName, Email = req.Email, Phone = req.Phone,
            RoleId = staffRole.Id,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.Staffs.Add(new Staff
        {
            UserId = user.Id,
            DateJoined = req.DateJoined is not null ? DateOnly.Parse(req.DateJoined) : null,
            SubjectHandled = req.SubjectHandled,
            Remarks = req.Remarks,
        });
        await db.SaveChangesAsync();
        return Ok(new { message = "Staff created", userId = user.Id });
    }

    [HttpPut("staff/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStaff(int userId, [FromBody] UpdateStaffRequest req)
    {
        var staff = await db.Staffs.Include(s => s.User).FirstOrDefaultAsync(s => s.UserId == userId);
        if (staff is null) return NotFound();

        staff.User.FullName = req.FullName;
        staff.User.Email = req.Email;
        staff.User.Phone = req.Phone;
        staff.DateJoined = req.DateJoined is not null ? DateOnly.Parse(req.DateJoined) : null;
        staff.SubjectHandled = req.SubjectHandled;
        staff.Remarks = req.Remarks;
        await db.SaveChangesAsync();
        return Ok(new { message = "Updated" });
    }

    [HttpDelete("staff/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteStaff(int userId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null) return NotFound();
        user.IsActive = false;
        await db.SaveChangesAsync();
        return Ok(new { message = "Deactivated" });
    }

    // ── STUDENTS ───────────────────────────────────────────────────────────

    [HttpGet("students")]
    public async Task<IActionResult> GetStudents()
    {
        var list = await db.Students
            .Include(s => s.User)
            .Select(s => new StudentDto(
                s.UserId, s.User.FullName, s.User.Email, s.User.Phone,
                s.AdmissionNumber,
                s.AdmissionDate.HasValue ? s.AdmissionDate.Value.ToString("yyyy-MM-dd") : null,
                s.DateOfBirth.HasValue ? s.DateOfBirth.Value.ToString("yyyy-MM-dd") : null,
                s.Address))
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("students")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Username == req.Username))
            return BadRequest(new { message = "Username already taken" });

        var studentRole = await db.Roles.FirstAsync(r => r.RoleName == "Student");
        var user = new User
        {
            Username = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            FullName = req.FullName, Email = req.Email, Phone = req.Phone,
            RoleId = studentRole.Id,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        db.Students.Add(new Student
        {
            UserId = user.Id,
            AdmissionNumber = req.AdmissionNumber,
            AdmissionDate = req.AdmissionDate is not null ? DateOnly.Parse(req.AdmissionDate) : null,
            DateOfBirth = req.DateOfBirth is not null ? DateOnly.Parse(req.DateOfBirth) : null,
            Address = req.Address,
        });
        await db.SaveChangesAsync();
        return Ok(new { message = "Student created", userId = user.Id });
    }

    [HttpPut("students/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStudent(int userId, [FromBody] UpdateStudentRequest req)
    {
        var student = await db.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.UserId == userId);
        if (student is null) return NotFound();

        student.User.FullName = req.FullName;
        student.User.Email = req.Email;
        student.User.Phone = req.Phone;
        student.AdmissionNumber = req.AdmissionNumber;
        student.AdmissionDate = req.AdmissionDate is not null ? DateOnly.Parse(req.AdmissionDate) : null;
        student.DateOfBirth = req.DateOfBirth is not null ? DateOnly.Parse(req.DateOfBirth) : null;
        student.Address = req.Address;
        await db.SaveChangesAsync();
        return Ok(new { message = "Updated" });
    }

    [HttpDelete("students/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteStudent(int userId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null) return NotFound();
        user.IsActive = false;
        await db.SaveChangesAsync();
        return Ok(new { message = "Deactivated" });
    }
}
