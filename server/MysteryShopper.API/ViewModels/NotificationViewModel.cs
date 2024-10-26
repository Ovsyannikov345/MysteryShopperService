using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class NotificationViewModel
    {
        public Guid Id { get; set; }

        public required string Text { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        public Guid? UserId { get; set; }

        public User? User { get; set; }

        public Guid? CompanyId { get; set; }

        public Company? Company { get; set; }
    }
}
