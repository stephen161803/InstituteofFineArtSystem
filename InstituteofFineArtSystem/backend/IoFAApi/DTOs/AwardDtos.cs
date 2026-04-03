namespace IoFAApi.DTOs;

public record AwardDto(int Id, string AwardName, string? Description);
public record CreateAwardRequest(string AwardName, string? Description);

public record CompetitionAwardDto(int Id, int CompetitionId, int AwardId, string AwardName, string? Description);

public record StudentAwardDto(
    int Id,
    int SubmissionId,
    int CompetitionAwardId,
    string? AwardName,
    int AwardedBy,
    string AwardedDate,
    string? StudentName,
    string? CompetitionTitle,
    string? SubmissionTitle
);

public record CreateStudentAwardRequest(int SubmissionId, int CompetitionAwardId);
