namespace IoFAApi.Models;

public class Competition
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? CreatedBy { get; set; }
    public string Status { get; set; } = "Upcoming";

    public User? Creator { get; set; }
    public ICollection<CompetitionCriteria> CompetitionCriteria { get; set; } = [];
    public ICollection<Submission> Submissions { get; set; } = [];
}
