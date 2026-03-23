namespace IoFAApi.Models;

public class Exhibition
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = "Planned";

    public ICollection<ExhibitionSubmission> ExhibitionSubmissions { get; set; } = [];
}
