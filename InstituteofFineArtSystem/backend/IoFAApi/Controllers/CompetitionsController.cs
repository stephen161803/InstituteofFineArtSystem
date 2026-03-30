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
            cc.Criteria.CriteriaCode, cc.Criteria.CriteriaName)).ToList()
    );

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await db.Competitions
            .Include(c => c.CompetitionCriteria).ThenInclude(cc => cc.Criteria)
            .OrderByDescending(c => c.StartDate)
            .ToListAsync();
        return Ok(list.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await db.Competitions
            .Include(c => c.CompetitionCriteria).ThenInclude(cc => cc.Criteria)
            .FirstOrDefaultAsync(c => c.Id == id);
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

    [HttpPost]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCompetitionRequest req)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var comp = new Competition
        {
            Title = req.Title, Description = req.Description,
            StartDate = DateTime.Parse(req.StartDate),
            EndDate = DateTime.Parse(req.EndDate),
            Status = req.Status, CreatedBy = userId,
        };
        db.Competitions.Add(comp);
        await db.SaveChangesAsync();

        foreach (var cw in req.Criteria)
            db.CompetitionCriteria.Add(new CompetitionCriteria
                { CompetitionId = comp.Id, CriteriaId = cw.CriteriaId, WeightPercent = cw.WeightPercent });
        await db.SaveChangesAsync();

        await db.Entry(comp).Collection(c => c.CompetitionCriteria).Query()
            .Include(cc => cc.Criteria).LoadAsync();
        return Ok(ToDto(comp));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCompetitionRequest req)
    {
        var comp = await db.Competitions
            .Include(c => c.CompetitionCriteria)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (comp is null) return NotFound();

        comp.Title = req.Title; comp.Description = req.Description;
        comp.StartDate = DateTime.Parse(req.StartDate);
        comp.EndDate = DateTime.Parse(req.EndDate);
        comp.Status = req.Status;

        db.CompetitionCriteria.RemoveRange(comp.CompetitionCriteria);
        foreach (var cw in req.Criteria)
            db.CompetitionCriteria.Add(new CompetitionCriteria
                { CompetitionId = comp.Id, CriteriaId = cw.CriteriaId, WeightPercent = cw.WeightPercent });

        await db.SaveChangesAsync();
        await db.Entry(comp).Collection(c => c.CompetitionCriteria).Query()
            .Include(cc => cc.Criteria).LoadAsync();
        return Ok(ToDto(comp));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Delete(int id)
    {
        var comp = await db.Competitions
            .Include(c => c.CompetitionCriteria)
            .Include(c => c.Submissions)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (comp is null) return NotFound();

        // Check if has submissions — prevent delete if so
        if (comp.Submissions.Any())
            return BadRequest(new { message = $"Cannot delete: this competition has {comp.Submissions.Count} submission(s). Remove submissions first." });

        // Remove criteria first
        db.CompetitionCriteria.RemoveRange(comp.CompetitionCriteria);
        db.Competitions.Remove(comp);
        await db.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
