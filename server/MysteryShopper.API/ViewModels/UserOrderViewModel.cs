using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.API.ViewModels;

public class UserOrderViewModel
{
    public Guid Id { get; set; }

    public required OrderViewModel Order { get; set; }

    public required UserProfileViewModel User { get; set; }

    public required List<ReviewViewModel> CompanyReviews { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? RequestedAt { get; set; }

    public DateTime? AcceptedAt { get; set; }

    public UserOrderStatus Status { get; set; } = UserOrderStatus.Requested;
}
