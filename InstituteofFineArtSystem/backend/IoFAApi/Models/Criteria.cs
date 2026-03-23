namespace IoFAApi.Models;

public class Criteria
{
    public int Id { get; set; }
    public string CriteriaCode { get; set; } = string.Empty;
    public string CriteriaName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<CompetitionCriteria> CompetitionCriteria { get; set; } = [];
    public ICollection<GradeDetail> GradeDetails { get; set; } = [];
}
