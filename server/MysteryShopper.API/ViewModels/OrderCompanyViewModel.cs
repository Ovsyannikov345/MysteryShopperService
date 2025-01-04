namespace MysteryShopper.API.ViewModels;

public class OrderCompanyViewModel
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public DateTime? CreatedAt { get; set; }

    public IEnumerable<OrderCompanyReviewViewModel> CompanyReviews { get; set; } = [];
}
