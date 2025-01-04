using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Report : EntityBase
{
    [MaxLength(100)]
    public required string Title { get; set; }

    [Column(TypeName = "text")]
    public required string Description { get; set; }

    public short Grade { get; set; }

    public Guid UserId { get; set; }

    public required virtual User User { get; set; }

    public Guid OrderId { get; set; }

    public required virtual Order Order { get; set; }

    public required virtual ReportCorrection? ReportCorrection { get; set; }
}
