namespace MysteryShopper.API.ViewModels;

public class ContactPersonToUpdateViewModel
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Surname { get; set; }

    public string? Patronymic { get; set; }

    public required string Phone { get; set; }

    public required string Email { get; set; }
}
