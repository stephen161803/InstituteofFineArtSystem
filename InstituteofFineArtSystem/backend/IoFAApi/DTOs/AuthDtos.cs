namespace IoFAApi.DTOs;

public record LoginRequest(string Username, string Password);

public record RegisterRequest(
    string Username,
    string Password,
    string FullName,
    string? Email,
    string? Phone
);

public record AuthResponse(
    string Token,
    int Id,
    string Username,
    string FullName,
    string Role,
    string? Email,
    string? Phone,
    string? AvatarUrl
);
