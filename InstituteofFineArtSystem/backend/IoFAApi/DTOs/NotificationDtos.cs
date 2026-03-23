namespace IoFAApi.DTOs;

public record NotificationDto(
    int Id,
    int UserId,
    string Type,
    string Title,
    string Message,
    bool IsRead,
    string? Link,
    int? CompetitionId,
    int? SubmissionId,
    int? AwardId,
    int? ExhibitionId,
    string Timestamp
);
