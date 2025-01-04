using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Dispute : EntityBase
{
    [Column(TypeName = "text")]
    public string? CompanyText { get; set; }

    [Column(TypeName = "text")]
    public string? UserText { get; set; }

    public DateTime? ResolvedAt { get; set; }

    public Guid OrderId { get; set; }

    public required virtual Order Order { get; set; }

    public Guid UserId { get; set; }

    public required virtual User User { get; set; }
}
