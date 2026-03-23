namespace IoFAApi.DTOs;

public record SubmissionDto(
    int Id,
    int CompetitionId,
    int StudentId,
    string? StudentName,
    string? Title,
    string? WorkUrl,
    string? FileName,
    decimal ProposedPrice,
    string? Description,
    string? Quotation,
    string? Poem,
    string SubmittedAt,
    SubmissionReviewDto? Review
);

public record SubmissionReviewDto(
    int Id,
    int SubmissionId,
    int StaffId,
    string? StaffName,
    string RatingLevel,
    string? Strengths,
    string? Weaknesses,
    string? Improvements,
    string ReviewedAt,
    List<GradeDetailDto> GradeDetails
);

public record GradeDetailDto(
    int Id,
    int ReviewId,
    int CriteriaId,
    string? CriteriaCode,
    string? CriteriaName,
    decimal RawScore,
    decimal? WeightPercent
);

public record CreateSubmissionRequest(
    int CompetitionId,
    string? Title,
    string? WorkUrl,
    string? FileName,
    decimal ProposedPrice,
    string? Description,
    string? Quotation,
    string? Poem
);

public record UpdateSubmissionRequest(
    string? Title,
    string? WorkUrl,
    string? FileName,
    decimal ProposedPrice,
    string? Description,
    string? Quotation,
    string? Poem
);

public record CreateReviewRequest(
    string RatingLevel,
    string? Strengths,
    string? Weaknesses,
    string? Improvements,
    List<GradeScoreRequest> GradeDetails
);

public record GradeScoreRequest(int CriteriaId, decimal RawScore);
