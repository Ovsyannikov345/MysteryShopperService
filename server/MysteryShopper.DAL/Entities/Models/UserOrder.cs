﻿using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.DAL.Entities.Models
{
    public partial class UserOrder
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }

        public virtual Order Order { get; set; } = null!;

        public Guid UserId { get; set; }

        public virtual User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public UserOrderStatus Status { get; set; } = UserOrderStatus.Requested;
    }
}
