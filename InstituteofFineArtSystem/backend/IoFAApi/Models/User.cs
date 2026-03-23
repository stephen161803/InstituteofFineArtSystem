namespace IoFAApi.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
    public int RoleId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public string? AvatarUrl { get; set; }

    public Role Role { get; set; } = null!;
    public Student? Student { get; set; }
    public Staff? Staff { get; set; }
    public Customer? Customer { get; set; }
}
