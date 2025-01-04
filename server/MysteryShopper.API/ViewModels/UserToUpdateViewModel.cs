using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.API.ViewModels;

public class UserToUpdateViewModel
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Surname { get; set; }

    public DateTime? BirthDate { get; set; }

    public required GenderType Gender { get; set; }

    public string? WorkingExperience { get; set; }

    public string? City { get; set; }

    public required string Phone { get; set; }

    public string? Description { get; set; }
}
