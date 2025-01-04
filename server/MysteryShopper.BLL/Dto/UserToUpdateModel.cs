using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.BLL.Dto;

public class UserToUpdateModel
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Surname { get; set; }

    public DateTime? BirthDate { get; set; }

    public GenderType Gender { get; set; }

    public string? WorkingExperience { get; set; }

    public string? City { get; set; }

    public required string Phone { get; set; }

    public string? Description { get; set; }
}
