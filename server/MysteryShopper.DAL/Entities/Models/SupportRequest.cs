using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class SupportRequest : EntityBase
{
    [MaxLength(600)]
    public required string Text { get; set; }

    public Guid? UserId { get; set; }

    public Guid? CompanyId { get; set; }

    public virtual Company? Company { get; set; }

    public virtual User? User { get; set; }
}
