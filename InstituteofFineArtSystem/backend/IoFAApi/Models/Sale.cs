namespace IoFAApi.Models;

public class Sale
{
    public int Id { get; set; }
    public int ExhibitionSubmissionId { get; set; }
    public int CustomerId { get; set; }
    public decimal SoldPrice { get; set; }
    public DateTime SoldDate { get; set; } = DateTime.UtcNow;

    public ExhibitionSubmission ExhibitionSubmission { get; set; } = null!;
    public Customer Customer { get; set; } = null!;
}
