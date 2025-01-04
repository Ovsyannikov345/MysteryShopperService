namespace MysteryShopper.API.ViewModels;

public class ReportToCreateViewModel
{
    public required string Title { get; set; }

    public required string Description { get; set; }

    public required short Grade { get; set; }

    public required Guid OrderId { get; set; }
}
