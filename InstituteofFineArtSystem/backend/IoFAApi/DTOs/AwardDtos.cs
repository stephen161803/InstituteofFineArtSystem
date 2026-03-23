namespace IoFAApi.DTOs;

public record AwardDto(int Id, string AwardName, string? Description);

public record StudentAwardDto(
    int Id,
    int SubmissionId,
    int AwardId,
    string? AwardName,
    int AwardedBy,
    string AwardedDate,
    string? StudentName,
    string? CompetitionTitle,
    string? SubmissionTitle
);

public record CreateStudentAwardRequest(int SubmissionId, int AwardId);
