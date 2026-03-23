namespace IoFAApi.Models;

public class Customer
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<Sale> Sales { get; set; } = [];
}
