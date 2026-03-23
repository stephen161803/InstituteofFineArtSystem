namespace IoFAApi.Models;

public class Submission
{
    public int Id { get; set; }
    public int CompetitionId { get; set; }
    public int StudentId { get; set; }
    public string? Title { get; set; }
    public string? WorkUrl { get; set; }
    public string? FileName { get; set; }
    public decimal ProposedPrice { get; set; }
    public string? Description { get; set; }
    public string? Quotation { get; set; }
    public string? Poem { get; set; }
    public DateTimeOffset SubmittedAt { get; set; } = DateTimeOffset.UtcNow;

    public Competition Competition { get; set; } = null!;
    public User Student { get; set; } = null!;
    public SubmissionReview? Review { get; set; }
    public ICollection<StudentAward> StudentAwards { get; set; } = [];
    public ICollection<ExhibitionSubmission> ExhibitionSubmissions { get; set; } = [];
}
