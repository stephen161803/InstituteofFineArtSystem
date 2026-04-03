namespace IoFAApi.Models;

public class StudentAward
{
    public int Id { get; set; }
    public int SubmissionId { get; set; }
    public int CompetitionAwardId { get; set; }
    public int AwardedBy { get; set; }
    public DateOnly AwardedDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

    public Submission Submission { get; set; } = null!;
    public CompetitionAward CompetitionAward { get; set; } = null!;
    public User AwardedByUser { get; set; } = null!;
}
