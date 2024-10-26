namespace MysteryShopper.API.ViewModels
{
    public class ReportCorrectionToCreateViewModel
    {
        public required string Description { get; set; }

        public Guid ReportId { get; set; }
    }
}
