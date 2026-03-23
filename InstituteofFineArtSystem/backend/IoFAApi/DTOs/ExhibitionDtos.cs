namespace IoFAApi.DTOs;

public record ExhibitionDto(
    int Id,
    string Title,
    string? Location,
    string? StartDate,
    string? EndDate,
    string Status,
    List<ExhibitionSubmissionDto> Submissions
);

public record ExhibitionSubmissionDto(
    int Id,
    int ExhibitionId,
    int SubmissionId,
    string? SubmissionTitle,
    string? StudentName,
    string? WorkUrl,
    decimal ProposedPrice,
    string Status,
    SaleDto? Sale
);

public record SaleDto(
    int Id,
    int ExhibitionSubmissionId,
    int CustomerId,
    string? CustomerName,
    decimal SoldPrice,
    string SoldDate,
    string? SubmissionTitle,
    string? ExhibitionTitle,
    string? WorkUrl = null
);

public record CreateExhibitionRequest(
    string Title,
    string? Location,
    string? StartDate,
    string? EndDate,
    string Status
);

public record UpdateExhibitionRequest(
    string Title,
    string? Location,
    string? StartDate,
    string? EndDate,
    string Status
);

public record AddExhibitionSubmissionRequest(int SubmissionId, decimal ProposedPrice);

public record CreateSaleRequest(int ExhibitionSubmissionId, int CustomerId, decimal SoldPrice);

public record CustomerPurchaseRequest(int ExhibitionSubmissionId, decimal SoldPrice);
