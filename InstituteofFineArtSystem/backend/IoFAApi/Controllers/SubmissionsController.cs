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
public class SubmissionsController(AppDbContext db) : ControllerBase
{
    private int? CurrentUserIdOrNull =>
        int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var id) ? id : null;

    private int CurrentUserId =>
        int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

    private static SubmissionDto ToDto(Submission s, IEnumerable<CompetitionCriteria>? compCriteria = null) => new(
        s.Id, s.CompetitionId, s.StudentId,
        s.Student?.FullName,
        s.Title, s.WorkUrl, s.FileName, s.ProposedPrice,
        s.Description, s.Quotation, s.Poem,
        s.SubmittedAt.ToString("o"),
        s.Review is null ? null : new SubmissionReviewDto(
            s.Review.Id, s.Review.SubmissionId, s.Review.StaffId,
            s.Review.Staff?.FullName,
            s.Review.RatingLevel, s.Review.Strengths, s.Review.Weaknesses, s.Review.Improvements,
            s.Review.ReviewedAt.ToString("o"),
            s.Review.GradeDetails.Select(g => new GradeDetailDto(
                g.Id, g.ReviewId, g.CriteriaId,
                g.Criteria?.CriteriaCode, g.Criteria?.CriteriaName,
                g.RawScore,
                compCriteria?.FirstOrDefault(cc => cc.CriteriaId == g.CriteriaId)?.WeightPercent)).ToList()
        )
    );

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? competitionId)
    {
        var q = db.Submissions
            .Include(s => s.Student)
            .Include(s => s.Review).ThenInclude(r => r!.Staff)
            .Include(s => s.Review).ThenInclude(r => r!.GradeDetails).ThenInclude(g => g.Criteria)
            .AsQueryable();

        if (competitionId.HasValue) q = q.Where(s => s.CompetitionId == competitionId.Value);

        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (role == "student" && CurrentUserIdOrNull.HasValue)
            q = q.Where(s => s.StudentId == CurrentUserIdOrNull.Value);

        var subs = await q.ToListAsync();

        // Load CompetitionCriteria for all competitions in result
        var compIds = subs.Select(s => s.CompetitionId).Distinct().ToList();
        var allCriteria = await db.CompetitionCriteria
            .Where(cc => compIds.Contains(cc.CompetitionId))
            .ToListAsync();

        return Ok(subs.Select(s => ToDto(s, allCriteria.Where(cc => cc.CompetitionId == s.CompetitionId))));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var s = await db.Submissions
            .Include(s => s.Student)
            .Include(s => s.Review).ThenInclude(r => r!.Staff)
            .Include(s => s.Review).ThenInclude(r => r!.GradeDetails).ThenInclude(g => g.Criteria)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (s is null) return NotFound();

        var criteria = await db.CompetitionCriteria
            .Where(cc => cc.CompetitionId == s.CompetitionId)
            .ToListAsync();

        return Ok(ToDto(s, criteria));
    }

    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Create([FromBody] CreateSubmissionRequest req)
    {
        var competition = await db.Competitions.FirstOrDefaultAsync(c => c.Id == req.CompetitionId && !c.IsDeleted);
        if (competition is null)
            return BadRequest(new { message = "Competition not found" });
        if (competition.Status != "Ongoing")
            return BadRequest(new { message = "Submissions are only accepted for ongoing competitions" });

        if (req.ProposedPrice <= 0)
            return BadRequest(new { message = "Proposed price is required and must be greater than 0" });
        if (string.IsNullOrWhiteSpace(req.Description))
            return BadRequest(new { message = "Story / Reason for Entering is required" });

        var alreadySubmitted = await db.Submissions
            .AnyAsync(s => s.CompetitionId == req.CompetitionId && s.StudentId == CurrentUserId);
        if (alreadySubmitted)
            return BadRequest(new { message = "You have already submitted to this competition" });

        var sub = new Submission
        {
            CompetitionId = req.CompetitionId, StudentId = CurrentUserId,
            Title = req.Title, WorkUrl = req.WorkUrl, FileName = req.FileName,
            ProposedPrice = req.ProposedPrice, Description = req.Description,
            Quotation = req.Quotation, Poem = req.Poem,
        };
        db.Submissions.Add(sub);
        await db.SaveChangesAsync();
        await db.Entry(sub).Reference(s => s.Student).LoadAsync();
        var criteria = await db.CompetitionCriteria.Where(cc => cc.CompetitionId == sub.CompetitionId).ToListAsync();
        return Ok(ToDto(sub, criteria));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSubmissionRequest req)
    {
        var sub = await db.Submissions.FindAsync(id);
        if (sub is null) return NotFound();

        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (role == "student" && sub.StudentId != CurrentUserId) return Forbid();

        sub.Title = req.Title; sub.WorkUrl = req.WorkUrl; sub.FileName = req.FileName;
        sub.ProposedPrice = req.ProposedPrice; sub.Description = req.Description;
        sub.Quotation = req.Quotation; sub.Poem = req.Poem;
        await db.SaveChangesAsync();

        await db.Entry(sub).Reference(s => s.Student).LoadAsync();
        await db.Entry(sub).Reference(s => s.Review).LoadAsync();
        var criteria2 = await db.CompetitionCriteria.Where(cc => cc.CompetitionId == sub.CompetitionId).ToListAsync();
        return Ok(ToDto(sub, criteria2));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sub = await db.Submissions.FindAsync(id);
        if (sub is null) return NotFound();

        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (role == "student" && sub.StudentId != CurrentUserId) return Forbid();

        db.Submissions.Remove(sub);
        await db.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }

    // ── REVIEWS ────────────────────────────────────────────────────────────

    [HttpPost("{id}/review")]
    [Authorize(Roles = "Staff,Manager")]
    public async Task<IActionResult> CreateReview(int id, [FromBody] CreateReviewRequest req)
    {
        var sub = await db.Submissions.FindAsync(id);
        if (sub is null) return NotFound();

        // Load CompetitionCriteria for validation and weightPercent
        var compCriteria = await db.CompetitionCriteria
            .Where(cc => cc.CompetitionId == sub.CompetitionId)
            .ToListAsync();

        var existing = await db.SubmissionReviews.FirstOrDefaultAsync(r => r.SubmissionId == id);
        if (existing is not null)
        {
            existing.RatingLevel = req.RatingLevel;
            existing.Strengths = req.Strengths;
            existing.Weaknesses = req.Weaknesses;
            existing.Improvements = req.Improvements;
            existing.ReviewedAt = DateTimeOffset.UtcNow;
            existing.StaffId = CurrentUserId;

            db.GradeDetails.RemoveRange(db.GradeDetails.Where(g => g.ReviewId == existing.Id));
            foreach (var g in req.GradeDetails)
                db.GradeDetails.Add(new GradeDetail { ReviewId = existing.Id, CriteriaId = g.CriteriaId, RawScore = g.RawScore });
        }
        else
        {
            var review = new SubmissionReview
            {
                SubmissionId = id, StaffId = CurrentUserId,
                RatingLevel = req.RatingLevel, Strengths = req.Strengths,
                Weaknesses = req.Weaknesses, Improvements = req.Improvements,
                ReviewedAt = DateTimeOffset.UtcNow,
            };
            db.SubmissionReviews.Add(review);
            await db.SaveChangesAsync();

            foreach (var g in req.GradeDetails)
                db.GradeDetails.Add(new GradeDetail { ReviewId = review.Id, CriteriaId = g.CriteriaId, RawScore = g.RawScore });
        }

        await db.SaveChangesAsync();
        return Ok(new { message = "Review saved" });
    }
}
