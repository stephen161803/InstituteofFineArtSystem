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
    // ── AWARD TEMPLATES ────────────────────────────────────────────────────

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAwards() =>
        Ok(await db.Awards.OrderBy(a => a.AwardName)
            .Select(a => new AwardDto(a.Id, a.AwardName, a.Description)).ToListAsync());

    [HttpPost]
    [Authorize(Roles = "Admin,Manager,Staff")]
    public async Task<IActionResult> CreateAward([FromBody] CreateAwardRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.AwardName))
            return BadRequest(new { message = "Award name is required" });

        // Avoid duplicates
        if (await db.Awards.AnyAsync(a => a.AwardName == req.AwardName))
            return BadRequest(new { message = "Award with this name already exists" });

        var award = new Award { AwardName = req.AwardName, Description = req.Description };
        db.Awards.Add(award);
        await db.SaveChangesAsync();
        return Ok(new AwardDto(award.Id, award.AwardName, award.Description));
    }

    // ── STUDENT AWARDS ─────────────────────────────────────────────────────

    [HttpGet("student-awards")]
    [AllowAnonymous]
    public async Task<IActionResult> GetStudentAwards([FromQuery] int? submissionId, [FromQuery] int? studentId)
    {
        var q = db.StudentAwards
            .Include(sa => sa.Submission).ThenInclude(s => s.Student)
            .Include(sa => sa.Submission).ThenInclude(s => s.Competition)
            .Include(sa => sa.CompetitionAward).ThenInclude(ca => ca.Award)
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
            sa.Id, sa.SubmissionId, sa.CompetitionAwardId, sa.CompetitionAward.Award.AwardName,
            sa.AwardedBy, sa.AwardedDate.ToString("yyyy-MM-dd"),
            sa.Submission.Student.FullName,
            sa.Submission.Competition.Title,
            sa.Submission.Title)));
    }

    [HttpPost("student-awards")]
    [Authorize(Roles = "Admin,Manager,Staff")]
    public async Task<IActionResult> GrantAward([FromBody] CreateStudentAwardRequest req)
    {
        var submission = await db.Submissions
            .Include(s => s.Competition)
            .FirstOrDefaultAsync(s => s.Id == req.SubmissionId);
        if (submission is null) return NotFound(new { message = "Submission not found" });

        var competitionAward = await db.CompetitionAwards.FindAsync(req.CompetitionAwardId);
        if (competitionAward is null) return NotFound(new { message = "Award not found" });

        if (competitionAward.CompetitionId != submission.CompetitionId)
            return BadRequest(new { message = "Award does not belong to this competition" });

        // Each award can only be granted to ONE submission
        var alreadyGranted = await db.StudentAwards
            .AnyAsync(sa => sa.CompetitionAwardId == req.CompetitionAwardId);
        if (alreadyGranted)
            return BadRequest(new { message = "This award has already been granted to another submission" });

        var awardedBy = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var studentAward = new StudentAward
        {
            SubmissionId = req.SubmissionId,
            CompetitionAwardId = req.CompetitionAwardId,
            AwardedBy = awardedBy,
            AwardedDate = DateOnly.FromDateTime(DateTime.Today),
        };
        db.StudentAwards.Add(studentAward);
        await db.SaveChangesAsync();
        return Ok(new { message = "Award granted", id = studentAward.Id });
    }

    [HttpDelete("student-awards/{id}")]
    [Authorize(Roles = "Admin,Manager,Staff")]
    public async Task<IActionResult> RevokeAward(int id)
    {
        var award = await db.StudentAwards.FindAsync(id);
        if (award is null) return NotFound();
        db.StudentAwards.Remove(award);
        await db.SaveChangesAsync();
        return Ok(new { message = "Revoked" });
    }
}
