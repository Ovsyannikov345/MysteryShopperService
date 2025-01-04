namespace MysteryShopper.API.ViewModels;

public class ReportCorrectionToCreateViewModel
{
    public required string Description { get; set; }

    public required Guid ReportId { get; set; }
}
