using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.API.ViewModels;

public class UserOrderViewModel
{
    public Guid Id { get; set; }

    public required OrderViewModel Order { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public UserOrderStatus Status { get; set; } = UserOrderStatus.Requested;
}
