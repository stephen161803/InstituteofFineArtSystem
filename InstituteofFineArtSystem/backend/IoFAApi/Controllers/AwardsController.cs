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
public class AwardsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAwards() =>
        Ok(await db.Awards.Select(a => new AwardDto(a.Id, a.AwardName, a.Description)).ToListAsync());

    [HttpGet("student-awards")]
    [AllowAnonymous]
    public async Task<IActionResult> GetStudentAwards([FromQuery] int? submissionId, [FromQuery] int? studentId)
    {
        var q = db.StudentAwards
            .Include(sa => sa.Submission).ThenInclude(s => s.Student)
            .Include(sa => sa.Submission).ThenInclude(s => s.Competition)
            .Include(sa => sa.Award)
            .AsQueryable();

        if (submissionId.HasValue) q = q.Where(sa => sa.SubmissionId == submissionId.Value);
        if (studentId.HasValue) q = q.Where(sa => sa.Submission.StudentId == studentId.Value);

        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (role == "student")
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            q = q.Where(sa => sa.Submission.StudentId == userId);
        }

        var list = await q.ToListAsync();
        return Ok(list.Select(sa => new StudentAwardDto(
            sa.Id, sa.SubmissionId, sa.AwardId, sa.Award.AwardName,
            sa.AwardedBy, sa.AwardedDate.ToString("yyyy-MM-dd"),
            sa.Submission.Student.FullName,
            sa.Submission.Competition.Title,
            sa.Submission.Title)));
    }

    [HttpPost("student-awards")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GrantAward([FromBody] CreateStudentAwardRequest req)
    {
        var awardedBy = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var award = new StudentAward
        {
            SubmissionId = req.SubmissionId, AwardId = req.AwardId, AwardedBy = awardedBy,
        };
        db.StudentAwards.Add(award);
        await db.SaveChangesAsync();
        return Ok(new { message = "Award granted", id = award.Id });
    }

    [HttpDelete("student-awards/{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> RevokeAward(int id)
    {
        var award = await db.StudentAwards.FindAsync(id);
        if (award is null) return NotFound();
        db.StudentAwards.Remove(award);
        await db.SaveChangesAsync();
        return Ok(new { message = "Revoked" });
    }
}
