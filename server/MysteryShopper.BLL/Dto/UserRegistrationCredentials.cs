using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.BLL.Dto
{
    public record UserRegistrationCredentials(
        string Name,
        string Surname,
        DateTime? BirthDate,
        GenderType Gender,
        string? WorkingExperience,
        string? City,
        string Phone,
        string? Description,
        string Email,
        string Password)
    { }
}
