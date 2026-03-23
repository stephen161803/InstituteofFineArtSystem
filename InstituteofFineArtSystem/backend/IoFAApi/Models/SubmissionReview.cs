namespace IoFAApi.Models;

public class SubmissionReview
{
    public int Id { get; set; }
    public int SubmissionId { get; set; }
    public int StaffId { get; set; }
    public string RatingLevel { get; set; } = string.Empty;
    public string? Strengths { get; set; }
    public string? Weaknesses { get; set; }
    public string? Improvements { get; set; }
    public DateTimeOffset ReviewedAt { get; set; } = DateTimeOffset.UtcNow;

    public Submission Submission { get; set; } = null!;
    public User Staff { get; set; } = null!;
    public ICollection<GradeDetail> GradeDetails { get; set; } = [];
}
