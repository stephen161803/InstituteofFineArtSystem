using IoFAApi.Data;
using IoFAApi.DTOs;
using IoFAApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IoFAApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExhibitionsController(AppDbContext db) : ControllerBase
{
    private static ExhibitionDto ToDto(Exhibition e) => new(
        e.Id, e.Title, e.Location,
        e.StartDate?.ToString("yyyy-MM-dd"), e.EndDate?.ToString("yyyy-MM-dd"),
        e.Status,
        e.ExhibitionSubmissions.Select(es => new ExhibitionSubmissionDto(
            es.Id, es.ExhibitionId, es.SubmissionId,
            es.Submission?.Title, es.Submission?.Student?.FullName, es.Submission?.WorkUrl,
            es.ProposedPrice, es.Status,
            es.Sales.FirstOrDefault() is Sale s ? new SaleDto(
                s.Id, s.ExhibitionSubmissionId, s.CustomerId,
                s.Customer?.User?.FullName, s.SoldPrice,
                s.SoldDate.ToString("o"),
                es.Submission?.Title, e.Title) : null
        )).ToList()
    );

    private static string CalcStatus(DateOnly? startDate, DateOnly? endDate)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (startDate.HasValue && today < startDate.Value) return "Upcoming";
        if (endDate.HasValue && today > endDate.Value) return "Completed";
        return "Ongoing";
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        // Auto-update status based on dates
        await db.Database.ExecuteSqlRawAsync(
            "UPDATE Exhibitions SET Status = 'Ongoing' WHERE Status = 'Upcoming' AND StartDate <= {0}", today);
        await db.Database.ExecuteSqlRawAsync(
            "UPDATE Exhibitions SET Status = 'Completed' WHERE Status = 'Ongoing' AND EndDate < {0}", today);

        var list = await db.Exhibitions
            .Include(e => e.ExhibitionSubmissions)
                .ThenInclude(es => es.Submission).ThenInclude(s => s.Student)
            .Include(e => e.ExhibitionSubmissions)
                .ThenInclude(es => es.Sales).ThenInclude(s => s.Customer).ThenInclude(c => c.User)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();
        return Ok(list.Select(ToDto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var e = await db.Exhibitions
            .Include(e => e.ExhibitionSubmissions)
                .ThenInclude(es => es.Submission).ThenInclude(s => s.Student)
            .Include(e => e.ExhibitionSubmissions)
                .ThenInclude(es => es.Sales).ThenInclude(s => s.Customer).ThenInclude(c => c.User)
            .FirstOrDefaultAsync(e => e.Id == id);
        return e is null ? NotFound() : Ok(ToDto(e));
    }

    [HttpPost]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateExhibitionRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { message = "Title is required" });

        DateOnly? startDate = null, endDate = null;
        if (req.StartDate is not null && !DateOnly.TryParse(req.StartDate, out var sd))
            return BadRequest(new { message = "Invalid start date" });
        else if (req.StartDate is not null) startDate = DateOnly.Parse(req.StartDate);

        if (req.EndDate is not null && !DateOnly.TryParse(req.EndDate, out var ed))
            return BadRequest(new { message = "Invalid end date" });
        else if (req.EndDate is not null) endDate = DateOnly.Parse(req.EndDate);

        if (startDate.HasValue && endDate.HasValue && endDate <= startDate)
            return BadRequest(new { message = "End date must be after start date" });

        var ex = new Exhibition
        {
            Title = req.Title, Location = req.Location,
            Status = CalcStatus(startDate, endDate),
            StartDate = startDate, EndDate = endDate,
        };
        db.Exhibitions.Add(ex);
        await db.SaveChangesAsync();
        // Reload with empty collections to avoid null ref in ToDto
        ex.ExhibitionSubmissions = [];
        return Ok(ToDto(ex));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateExhibitionRequest req)
    {
        var ex = await db.Exhibitions.Include(e => e.ExhibitionSubmissions).FirstOrDefaultAsync(e => e.Id == id);
        if (ex is null) return NotFound();
        ex.Title = req.Title; ex.Location = req.Location;
        ex.StartDate = req.StartDate is not null ? DateOnly.Parse(req.StartDate) : null;
        ex.EndDate = req.EndDate is not null ? DateOnly.Parse(req.EndDate) : null;
        ex.Status = CalcStatus(ex.StartDate, ex.EndDate);
        await db.SaveChangesAsync();
        return Ok(ToDto(ex));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Delete(int id)
    {
        var ex = await db.Exhibitions.FindAsync(id);
        if (ex is null) return NotFound();
        db.Exhibitions.Remove(ex);
        await db.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }

    [HttpPost("{id}/submissions")]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> AddSubmission(int id, [FromBody] AddExhibitionSubmissionRequest req)
    {
        // Validate exhibition exists
        var exhibition = await db.Exhibitions.FindAsync(id);
        if (exhibition is null) return NotFound(new { message = "Exhibition not found" });

        // Validate submission exists
        var submission = await db.Submissions.FindAsync(req.SubmissionId);
        if (submission is null) return NotFound(new { message = "Submission not found" });

        // Check if already added to this exhibition
        var existing = await db.ExhibitionSubmissions
            .FirstOrDefaultAsync(es => es.ExhibitionId == id && es.SubmissionId == req.SubmissionId);
        if (existing is not null)
            return BadRequest(new { message = "This artwork is already in this exhibition" });

        var es = new ExhibitionSubmission
            { ExhibitionId = id, SubmissionId = req.SubmissionId, ProposedPrice = req.ProposedPrice };
        db.ExhibitionSubmissions.Add(es);
        await db.SaveChangesAsync();
        return Ok(new { message = "Added", id = es.Id });
    }

    [HttpDelete("submissions/{esId}")]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> RemoveSubmission(int esId)
    {
        var es = await db.ExhibitionSubmissions.FindAsync(esId);
        if (es is null) return NotFound();
        db.ExhibitionSubmissions.Remove(es);
        await db.SaveChangesAsync();
        return Ok(new { message = "Removed" });
    }

    [HttpPost("sales")]
    [Authorize(Roles = "Staff,Manager,Admin")]
    public async Task<IActionResult> CreateSale([FromBody] CreateSaleRequest req)
    {
        var es = await db.ExhibitionSubmissions.FindAsync(req.ExhibitionSubmissionId);
        if (es is null) return NotFound();

        var sale = new Sale
            { ExhibitionSubmissionId = req.ExhibitionSubmissionId, CustomerId = req.CustomerId, SoldPrice = req.SoldPrice };
        db.Sales.Add(sale);
        es.Status = "Sold";
        await db.SaveChangesAsync();
        return Ok(new { message = "Sale recorded", id = sale.Id });
    }

    // Customer self-purchase endpoint
    [HttpPost("purchase")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Purchase([FromBody] CustomerPurchaseRequest req)
    {
        var username = User.Identity?.Name;
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user is null) return Unauthorized();

        // Auto-create Customer record if not exists
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == user.Id);
        if (customer is null)
        {
            customer = new Customer { UserId = user.Id, Address = req.Address };
            db.Customers.Add(customer);
            await db.SaveChangesAsync();
        }
        else if (!string.IsNullOrWhiteSpace(req.Address))
        {
            // Update address if provided
            customer.Address = req.Address;
        }

        var es = await db.ExhibitionSubmissions.FindAsync(req.ExhibitionSubmissionId);
        if (es is null) return NotFound(new { message = "Artwork not found in exhibition" });
        if (es.Status == "Sold") return BadRequest(new { message = "This artwork has already been sold" });

        var sale = new Sale
            { ExhibitionSubmissionId = req.ExhibitionSubmissionId, CustomerId = customer.Id, SoldPrice = req.SoldPrice };
        db.Sales.Add(sale);
        es.Status = "Sold";
        await db.SaveChangesAsync();
        return Ok(new { message = "Purchase submitted successfully", id = sale.Id });
    }

    [HttpGet("my-sales")]
    [Authorize]
    public async Task<IActionResult> GetMySales()
    {
        var username = User.Identity?.Name;
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user is null) return Unauthorized();

        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == user.Id);
        if (customer is null) return Ok(Array.Empty<object>());

        var sales = await db.Sales
            .Include(s => s.ExhibitionSubmission)
                .ThenInclude(es => es.Submission)
            .Include(s => s.ExhibitionSubmission)
                .ThenInclude(es => es.Exhibition)
            .Where(s => s.CustomerId == customer.Id)
            .OrderByDescending(s => s.SoldDate)
            .Select(s => new SaleDto(
                s.Id, s.ExhibitionSubmissionId, s.CustomerId,
                null, s.SoldPrice, s.SoldDate.ToString("o"),
                s.ExhibitionSubmission.Submission != null ? s.ExhibitionSubmission.Submission.Title : null,
                s.ExhibitionSubmission.Exhibition != null ? s.ExhibitionSubmission.Exhibition.Title : null,
                s.ExhibitionSubmission.Submission != null ? s.ExhibitionSubmission.Submission.WorkUrl : null))
            .ToListAsync();

        return Ok(sales);
    }
}
