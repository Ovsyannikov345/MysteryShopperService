using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Notification : EntityBase
{
    [MaxLength(255)]
    public required string Text { get; set; }

    public bool IsRead { get; set; }

    public Guid? UserId { get; set; }

    public virtual User? User { get; set; }

    public Guid? CompanyId { get; set; }

    public virtual Company? Company { get; set; }
}
