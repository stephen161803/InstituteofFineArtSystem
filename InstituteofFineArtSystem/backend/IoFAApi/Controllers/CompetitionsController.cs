using IoFAApi.Data;
using IoFAApi.DTOs;
using IoFAApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IoFAApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompetitionsController(AppDbContext db) : ControllerBase
{
    private static CompetitionDto ToDto(Competition c) => new(
        c.Id, c.Title, c.Description,
        c.StartDate.ToString("yyyy-MM-dd"),
        c.EndDate.ToString("yyyy-MM-dd"),
        c.CreatedBy, c.Status,
        c.CompetitionCriteria.Select(cc => new CompetitionCriteriaDto(
            cc.Id, cc.CompetitionId, cc.CriteriaId, cc.WeightPercent,
            cc.Criteria.CriteriaCode, cc.Criteria.CriteriaName)).ToList(),
        c.CompetitionAwards.Select(ca => new CompetitionAwardDto(
            ca.Id, ca.CompetitionId, ca.AwardId,
            ca.Award.AwardName, ca.Award.Description)).ToList()
    );

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var now = DateTime.UtcNow;

        // Auto-update status based on dates (2 separate calls to avoid multi-statement issue)
        await db.Database.ExecuteSqlRawAsync(
            "UPDATE Competitions SET Status = 'Ongoing' WHERE IsDeleted = 0 AND Status = 'Upcoming' AND StartDate <= {0}",
            now);
        await db.Database.ExecuteSqlRawAsync(
            "UPDATE Competitions SET Status = 'Completed' WHERE IsDeleted = 0 AND Status = 'Ongoing' AND EndDate < {0}",
            now);

        var list = await db.Competitions
            .Include(c => c.CompetitionCriteria).ThenInclude(cc => cc.Criteria)
            .Include(c => c.CompetitionAwards).ThenInclude(ca => ca.Award)
            .Where(c => !c.IsDeleted)
            .OrderByDescending(c => c.StartDate)
            .ToListAsync();
        return Ok(list.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await db.Competitions
            .Include(c => c.CompetitionCriteria).ThenInclude(cc => cc.Criteria)
            .Include(c => c.CompetitionAwards).ThenInclude(ca => ca.Award)
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
        return c is null ? NotFound() : Ok(ToDto(c));
    }

    [HttpGet("criteria")]
    public async Task<IActionResult> GetCriteria()
    {
        var list = await db.Criteria.Where(c => c.IsActive)
            .Select(c => new CriteriaDto(c.Id, c.CriteriaCode, c.CriteriaName, c.IsActive))
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("criteria")]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> CreateCriteria([FromBody] CreateCriteriaRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.CriteriaName))
            return BadRequest(new { message = "Criteria name is required" });

        var code = req.CriteriaName.ToUpper().Replace(" ", "_");
        if (await db.Criteria.AnyAsync(c => c.CriteriaCode == code))
            return BadRequest(new { message = "Criteria with this name already exists" });

        var criteria = new Criteria { CriteriaCode = code, CriteriaName = req.CriteriaName, IsActive = true };
        db.Criteria.Add(criteria);
        await db.SaveChangesAsync();
        return Ok(new CriteriaDto(criteria.Id, criteria.CriteriaCode, criteria.CriteriaName, criteria.IsActive));
    }

    private static string CalcStatus(DateTime startDate, DateTime endDate)
    {
        var now = DateTime.UtcNow;
        if (now < startDate) return "Upcoming";
        if (now <= endDate) return "Ongoing";
        return "Completed";
    }

    [HttpPost]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCompetitionRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { message = "Title is required" });

        if (await db.Competitions.AnyAsync(c => c.Title == req.Title && !c.IsDeleted))
            return BadRequest(new { message = "A competition with this title already exists" });

        if (!DateTime.TryParse(req.StartDate, out var startDate))
            return BadRequest(new { message = "Invalid start date" });
        if (!DateTime.TryParse(req.EndDate, out var endDate))
            return BadRequest(new { message = "Invalid end date" });
        if (endDate <= startDate)
            return BadRequest(new { message = "End date must be after start date" });

        if (req.Criteria.Any() && req.Criteria.Sum(c => c.WeightPercent) != 100)
            return BadRequest(new { message = "Total criteria weight must equal 100%" });

        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var comp = new Competition
        {
            Title = req.Title, Description = req.Description,
            StartDate = startDate, EndDate = endDate,
            Status = CalcStatus(startDate, endDate), CreatedBy = userId,
        };
        db.Competitions.Add(comp);
        await db.SaveChangesAsync();

        foreach (var cw in req.Criteria)
            db.CompetitionCriteria.Add(new CompetitionCriteria
                { CompetitionId = comp.Id, CriteriaId = cw.CriteriaId, WeightPercent = cw.WeightPercent });

        foreach (var aw in req.Awards)
        {
            var award = await db.Awards.FindAsync(aw.AwardId);
            if (award is null) return BadRequest(new { message = $"Award ID {aw.AwardId} not found" });
            db.CompetitionAwards.Add(new CompetitionAward { CompetitionId = comp.Id, AwardId = aw.AwardId });
        }

        await db.SaveChangesAsync();

        await db.Entry(comp).Collection(c => c.CompetitionCriteria).Query()
            .Include(cc => cc.Criteria).LoadAsync();
        await db.Entry(comp).Collection(c => c.CompetitionAwards).Query()
            .Include(ca => ca.Award).LoadAsync();
        return Ok(ToDto(comp));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCompetitionRequest req)
    {
        var comp = await db.Competitions
            .Include(c => c.CompetitionCriteria)
            .Include(c => c.CompetitionAwards)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (comp is null) return NotFound();

        if (await db.Competitions.AnyAsync(c => c.Title == req.Title && c.Id != id && !c.IsDeleted))
            return BadRequest(new { message = "A competition with this title already exists" });

        comp.Title = req.Title; comp.Description = req.Description;
        comp.StartDate = DateTime.Parse(req.StartDate);
        comp.EndDate = DateTime.Parse(req.EndDate);
        comp.Status = CalcStatus(DateTime.Parse(req.StartDate), DateTime.Parse(req.EndDate));

        // Find criteria being removed
        var newCriteriaIds = req.Criteria.Select(c => c.CriteriaId).ToHashSet();
        var removedCriteriaIds = comp.CompetitionCriteria
            .Where(cc => !newCriteriaIds.Contains(cc.CriteriaId))
            .Select(cc => cc.CriteriaId)
            .ToHashSet();

        // Remove GradeDetails for removed criteria (from all reviews of this competition's submissions)
        if (removedCriteriaIds.Any())
        {
            var submissionIds = await db.Submissions
                .Where(s => s.CompetitionId == id)
                .Select(s => s.Id)
                .ToListAsync();

            var reviewIds = await db.SubmissionReviews
                .Where(r => submissionIds.Contains(r.SubmissionId))
                .Select(r => r.Id)
                .ToListAsync();

            var orphanGrades = await db.GradeDetails
                .Where(g => reviewIds.Contains(g.ReviewId) && removedCriteriaIds.Contains(g.CriteriaId))
                .ToListAsync();

            db.GradeDetails.RemoveRange(orphanGrades);
        }

        db.CompetitionCriteria.RemoveRange(comp.CompetitionCriteria);
        await db.SaveChangesAsync();

        foreach (var cw in req.Criteria)
            db.CompetitionCriteria.Add(new CompetitionCriteria
                { CompetitionId = comp.Id, CriteriaId = cw.CriteriaId, WeightPercent = cw.WeightPercent });

        // Update awards
        db.CompetitionAwards.RemoveRange(comp.CompetitionAwards);
        foreach (var aw in req.Awards)
        {
            var award = await db.Awards.FindAsync(aw.AwardId);
            if (award is null) return BadRequest(new { message = $"Award ID {aw.AwardId} not found" });
            db.CompetitionAwards.Add(new CompetitionAward { CompetitionId = comp.Id, AwardId = aw.AwardId });
        }

        await db.SaveChangesAsync();
        await db.Entry(comp).Collection(c => c.CompetitionCriteria).Query()
            .Include(cc => cc.Criteria).LoadAsync();
        await db.Entry(comp).Collection(c => c.CompetitionAwards).Query()
            .Include(ca => ca.Award).LoadAsync();
        return Ok(ToDto(comp));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager,Staff")]
    public async Task<IActionResult> Delete(int id)
    {
        var comp = await db.Competitions
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
        if (comp is null) return NotFound();

        // Only allow delete if status is Upcoming
        if (comp.Status != "Upcoming")
            return BadRequest(new { message = "Only upcoming competitions can be deleted." });

        // Soft delete
        comp.IsDeleted = true;
        await db.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
