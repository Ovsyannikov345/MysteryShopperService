using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Dto
{
    public class NotificationModel
    {
        public Guid Id { get; set; }

        public required string Text { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid? UserId { get; set; }

        public User? User { get; set; }

        public Guid? CompanyId { get; set; }

        public Company? Company { get; set; }
    }
}
