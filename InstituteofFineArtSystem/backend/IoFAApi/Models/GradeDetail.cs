namespace IoFAApi.Models;

public class GradeDetail
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public int CriteriaId { get; set; }
    public decimal RawScore { get; set; }

    public SubmissionReview Review { get; set; } = null!;
    public Criteria Criteria { get; set; } = null!;
}
