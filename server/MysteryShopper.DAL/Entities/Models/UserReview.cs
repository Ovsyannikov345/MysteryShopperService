using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class UserReview : EntityBase
{
    [MaxLength(255)]
    public string? Text { get; set; }

    public short Grade { get; set; }

    public Guid CompanyId { get; set; }

    public required virtual Company Company { get; set; }

    public Guid UserId { get; set; }

    public required virtual User User { get; set; }

    public Guid OrderId { get; set; }

    public required virtual Order Order { get; set; }
}
