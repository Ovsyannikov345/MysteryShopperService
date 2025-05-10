namespace MysteryShopper.BLL.Dto;

public class CompanyToUpdateModel
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required ContactPersonToUpdateModel ContactPerson { get; set; }
}
