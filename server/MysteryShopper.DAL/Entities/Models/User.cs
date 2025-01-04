using MysteryShopper.DAL.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class User : EntityBase
{
    [MaxLength(50)]
    public required string Name { get; set; }

    [MaxLength(50)]
    public required string Surname { get; set; }

    public DateTime? BirthDate { get; set; }

    public GenderType Gender { get; set; }

    public string? WorkingExperience { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(30)]
    public required string Phone { get; set; }

    [MaxLength(255)]
    public required string Email { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(255)]
    public required string Password { get; set; }

    public virtual ICollection<UserOrder> Orders { get; set; } = [];

    public virtual ICollection<Report> Reports { get; set; } = [];

    public virtual ICollection<Dispute> Disputes { get; set; } = [];

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = [];

    public virtual ICollection<UserReview> UserReviews { get; set; } = [];

    public virtual ICollection<SupportRequest> SupportRequests { get; set; } = [];

    public virtual ICollection<Notification> Notifications { get; set; } = [];
}
