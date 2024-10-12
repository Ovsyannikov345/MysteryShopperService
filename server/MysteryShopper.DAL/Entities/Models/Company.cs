using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Company
{
    public Guid Id { get; set; }

    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Password { get; set; } = string.Empty;

    public DateTime? CreatedAt { get; set; }

    public virtual ContactPerson ContactPerson { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = [];

    public virtual ICollection<ReportCorrection> ReportCorrections { get; set; } = [];

    public virtual ICollection<UserReview> UserReviews { get; set; } = [];

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = [];

    public virtual ICollection<SupportRequest> SupportRequests { get; set; } = [];

    public virtual ICollection<Notification> Notifications { get; set; } = [];
}
