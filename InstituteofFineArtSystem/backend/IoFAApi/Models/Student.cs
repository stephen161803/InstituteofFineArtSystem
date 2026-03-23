namespace IoFAApi.Models;

public class Student
{
    public int UserId { get; set; }
    public string AdmissionNumber { get; set; } = string.Empty;
    public DateOnly? AdmissionDate { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Address { get; set; }

    public User User { get; set; } = null!;
}
