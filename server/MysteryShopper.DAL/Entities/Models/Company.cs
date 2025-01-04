using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Company : EntityBase
{
    [MaxLength(255)]
    public required string Name { get; set; }

    [MaxLength(255)]
    public required string Email { get; set; }

    [MaxLength(255)]
    public required string Password { get; set; }

    public required virtual ContactPerson ContactPerson { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = [];

    public virtual ICollection<ReportCorrection> ReportCorrections { get; set; } = [];

    public virtual ICollection<UserReview> UserReviews { get; set; } = [];

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = [];

    public virtual ICollection<SupportRequest> SupportRequests { get; set; } = [];

    public virtual ICollection<Notification> Notifications { get; set; } = [];
}
