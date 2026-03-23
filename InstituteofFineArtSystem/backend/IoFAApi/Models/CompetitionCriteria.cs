namespace IoFAApi.Models;

public class CompetitionCriteria
{
    public int Id { get; set; }
    public int CompetitionId { get; set; }
    public int CriteriaId { get; set; }
    public decimal WeightPercent { get; set; }

    public Competition Competition { get; set; } = null!;
    public Criteria Criteria { get; set; } = null!;
}
