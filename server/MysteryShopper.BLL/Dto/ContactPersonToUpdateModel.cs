namespace MysteryShopper.BLL.Dto;

public class ContactPersonToUpdateModel
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Surname { get; set; }

    public string? Patronymic { get; set; }

    public required string Phone { get; set; }

    public required string Email { get; set; }
}
