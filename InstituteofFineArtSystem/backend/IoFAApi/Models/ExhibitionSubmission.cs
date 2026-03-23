namespace IoFAApi.Models;

public class ExhibitionSubmission
{
    public int Id { get; set; }
    public int ExhibitionId { get; set; }
    public int SubmissionId { get; set; }
    public decimal ProposedPrice { get; set; }
    public string Status { get; set; } = "Available";

    public Exhibition Exhibition { get; set; } = null!;
    public Submission Submission { get; set; } = null!;
    public ICollection<Sale> Sales { get; set; } = [];
}
