namespace IoFAApi.DTOs;

public record CompetitionDto(
    int Id,
    string Title,
    string? Description,
    string StartDate,
    string EndDate,
    int? CreatedBy,
    string Status,
    List<CompetitionCriteriaDto> Criteria,
    List<CompetitionAwardDto> Awards
);

public record CompetitionCriteriaDto(
    int Id,
    int CompetitionId,
    int CriteriaId,
    decimal WeightPercent,
    string? CriteriaCode,
    string? CriteriaName
);

public record CriteriaDto(int Id, string CriteriaCode, string CriteriaName, bool IsActive);

public record CreateCriteriaRequest(string CriteriaName);

public record CreateCompetitionRequest(
    string Title,
    string? Description,
    string StartDate,
    string EndDate,
    List<CriteriaWeightRequest> Criteria,
    List<AwardRequest> Awards
);

public record UpdateCompetitionRequest(
    string Title,
    string? Description,
    string StartDate,
    string EndDate,
    List<CriteriaWeightRequest> Criteria,
    List<AwardRequest> Awards
);

public record AwardRequest(string AwardName, string? Description);

public record CriteriaWeightRequest(int CriteriaId, decimal WeightPercent);
