namespace MysteryShopper.API.ViewModels;

public class UserReviewToCreateViewModel
{
    public string? Text { get; set; }

    public required short Grade { get; set; }

    public required Guid OrderId { get; set; }
}
