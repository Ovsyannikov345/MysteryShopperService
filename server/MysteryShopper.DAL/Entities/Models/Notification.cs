using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models
{
    public partial class Notification
    {
        public Guid Id { get; set; }

        [MaxLength(255)]
        public string Text { get; set; } = string.Empty;

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        public Guid? UserId { get; set; }

        public virtual User? User { get; set; }

        public Guid? CompanyId { get; set; }

        public virtual Company? Company { get; set; }
    }
}
