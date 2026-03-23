namespace IoFAApi.Models;

public class Staff
{
    public int UserId { get; set; }
    public DateOnly? DateJoined { get; set; }
    public string? SubjectHandled { get; set; }
    public string? Remarks { get; set; }

    public User User { get; set; } = null!;
}
