namespace MysteryShopper.API.ViewModels
{
    public class CompanyReviewToCreateViewModel
    {
        public string? Text { get; set; }

        public short Grade { get; set; }

        public Guid OrderId { get; set; }
    }
}
