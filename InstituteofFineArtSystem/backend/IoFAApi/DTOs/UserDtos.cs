namespace IoFAApi.DTOs;

public record UserDto(
    int Id,
    string Username,
    string FullName,
    string? Email,
    string? Phone,
    bool IsActive,
    int RoleId,
    string Role,
    string CreatedAt,
    string? AvatarUrl
);

public record UpdateProfileRequest(
    string FullName,
    string? Email,
    string? Phone,
    string? AvatarUrl,
    string? CurrentPassword,
    string? NewPassword
);

public record StaffDto(
    int UserId,
    string FullName,
    string? Email,
    string? Phone,
    string? DateJoined,
    string? SubjectHandled,
    string? Remarks,
    string? AvatarUrl
);

public record StudentDto(
    int UserId,
    string FullName,
    string? Email,
    string? Phone,
    string AdmissionNumber,
    string? AdmissionDate,
    string? DateOfBirth,
    string? Address,
    string? AvatarUrl
);

public record CreateStaffRequest(
    string Username,
    string Password,
    string FullName,
    string? Email,
    string? Phone,
    string? DateJoined,
    string? SubjectHandled,
    string? Remarks
);

public record UpdateStaffRequest(
    string FullName,
    string? Email,
    string? Phone,
    string? DateJoined,
    string? SubjectHandled,
    string? Remarks
);

public record CreateStudentRequest(
    string Username,
    string Password,
    string FullName,
    string? Email,
    string? Phone,
    string AdmissionNumber,
    string? AdmissionDate,
    string? DateOfBirth,
    string? Address
);

public record UpdateStudentRequest(
    string FullName,
    string? Email,
    string? Phone,
    string AdmissionNumber,
    string? AdmissionDate,
    string? DateOfBirth,
    string? Address
);

public record CustomerDto(
    int Id,
    int UserId,
    string FullName,
    string? Email,
    string? Phone,
    string? Address,
    string? Notes,
    string? CreatedAt,
    int PurchaseCount = 0,
    decimal TotalSpent = 0,
    string? AvatarUrl = null
);

public record UpdateCustomerRequest(
    string FullName,
    string? Email,
    string? Phone,
    string? Address,
    string? Notes
);

public record AdminUserDto(
    int Id,
    string Username,
    string FullName,
    string? Email,
    string? Phone,
    string Role,
    string CreatedAt,
    string? AvatarUrl = null
);

public record CreateAdminUserRequest(
    string Username,
    string Password,
    string FullName,
    string? Email,
    string? Phone,
    string Role  // "Admin" or "Manager"
);
