using MysteryShopper.DAL.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class User
{
    public Guid Id { get; set; }

    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Surname { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Patronymic { get; set; }

    public short? Age { get; set; }

    public GenderType Gender { get; set; }

    public string? WorkingExperience { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Description { get; set; }

    [MaxLength(255)]
    public string Password { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<UserOrder> Orders { get; set; } = [];

    public virtual ICollection<Request> Requests { get; set; } = [];

    public virtual ICollection<Report> Reports { get; set; } = [];

    public virtual ICollection<Dispute> Disputes { get; set; } = [];

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = [];

    public virtual ICollection<UserReview> UserReviews { get; set; } = [];

    public virtual ICollection<SupportRequest> SupportRequests { get; set; } = [];

    public virtual ICollection<Notification> Notifications { get; set; } = [];
}
