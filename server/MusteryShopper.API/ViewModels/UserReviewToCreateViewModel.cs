namespace MysteryShopper.API.ViewModels
{
    public class UserReviewToCreateViewModel
    {
        public string? Text { get; set; }

        public short Grade { get; set; }

        public Guid OrderId { get; set; }

        public Guid CompanyId { get; set; }
    }
}
