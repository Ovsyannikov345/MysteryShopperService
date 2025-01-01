using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Report : EntityBase
{
    [MaxLength(100)]
    public string Title { get; set; } = null!;

    [Column(TypeName = "text")]
    public string Description { get; set; } = null!;

    public short Grade { get; set; }

    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    public Guid OrderId { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual ReportCorrection? ReportCorrection { get; set; } = null!;
}
