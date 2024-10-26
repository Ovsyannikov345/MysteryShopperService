using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.API.ViewModels
{
    public class UserOrderViewModel
    {
        public Guid Id { get; set; }

        public virtual OrderViewModel Order { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public UserOrderStatus Status { get; set; } = UserOrderStatus.Requested;
    }
}
