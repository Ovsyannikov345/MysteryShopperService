using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models
{
    public partial class ReportCorrection
    {
        public Guid Id { get; set; }

        [Column(TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public Guid CompanyId { get; set; }

        public virtual Company Company { get; set; } = null!;

        public Guid ReportId { get; set; }

        public virtual Report Report { get; set; } = null!;
    }
}
