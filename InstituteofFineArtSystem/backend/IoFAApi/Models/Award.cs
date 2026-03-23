namespace IoFAApi.Models;

public class Award
{
    public int Id { get; set; }
    public string AwardName { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<StudentAward> StudentAwards { get; set; } = [];
}
