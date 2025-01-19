using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models;

public partial class ReportCorrection : EntityBase
{
    [Column(TypeName = "text")]
    public required string Description { get; set; }

    public Guid ReportId { get; set; }

    public required virtual Report Report { get; set; }
}
