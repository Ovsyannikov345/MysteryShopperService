using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models
{
    public partial class Dispute
    {
        public Guid Id { get; set; }

        [Column(TypeName = "text")]
        public string? CompanyText { get; set; }

        [Column(TypeName = "text")]
        public string? UserText { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ResolvedAt { get; set; }

        public Guid OrderId { get; set; }

        public virtual Order Order { get; set; } = null!;

        public Guid UserId { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
