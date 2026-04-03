namespace IoFAApi.Models;

public class CompetitionAward
{
    public int Id { get; set; }
    public int CompetitionId { get; set; }
    public string AwardName { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Competition Competition { get; set; } = null!;
    public ICollection<StudentAward> StudentAwards { get; set; } = [];
}
