using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.DAL.Entities.Models;

public partial class UserOrder : EntityBase
{
    public Guid OrderId { get; set; }

    public required virtual Order Order { get; set; }

    public Guid UserId { get; set; }

    public required virtual User User { get; set; }

    public UserOrderStatus Status { get; set; } = UserOrderStatus.Requested;
}
