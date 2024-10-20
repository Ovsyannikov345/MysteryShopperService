namespace MysteryShopper.API.ViewModels
{
    public class ReportToCreateViewModel
    {
        public required string Title { get; set; }

        public required string Description { get; set; }

        public short Grade { get; set; }

        public Guid OrderId { get; set; }
    }
}
