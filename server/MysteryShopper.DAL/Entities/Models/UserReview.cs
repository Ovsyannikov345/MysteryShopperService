using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class UserReview
{
    public Guid Id { get; set; }

    [MaxLength(255)]
    public string? Text { get; set; }

    public short Grade { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid CompanyId { get; set; }

    public virtual Company Company { get; set; } = null!;

    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    public Guid OrderId { get; set; }

    public virtual Order Order { get; set; } = null!;
}
