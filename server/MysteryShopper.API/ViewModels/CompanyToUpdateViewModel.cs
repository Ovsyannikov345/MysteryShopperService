namespace MysteryShopper.API.ViewModels;

public class CompanyToUpdateViewModel
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required ContactPersonToUpdateViewModel ContactPerson { get; set; }
}
