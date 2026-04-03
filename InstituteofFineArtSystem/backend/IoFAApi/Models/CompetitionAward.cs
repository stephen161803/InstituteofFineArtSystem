namespace IoFAApi.Models;

public class CompetitionAward
{
    public int Id { get; set; }
    public int CompetitionId { get; set; }
    public int AwardId { get; set; }

    public Competition Competition { get; set; } = null!;
    public Award Award { get; set; } = null!;
    public ICollection<StudentAward> StudentAwards { get; set; } = [];
}
