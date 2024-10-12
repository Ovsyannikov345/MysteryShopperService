using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Order
{
    public Guid Id { get; set; }

    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [MaxLength(255)]
    public string Place { get; set; } = string.Empty;

    public TimeSpan? TimeToComplete { get; set; }

    public int? Price { get; set; }

    public DateTime CreatedAt { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }

    public bool IsClosed { get; set; }

    public Guid CompanyId { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<UserOrder> Users { get; set; } = [];

    public virtual ICollection<Report> Reports { get; set; } = [];

    public virtual ICollection<Dispute> Disputes { get; set; } = [];

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = [];

    public virtual ICollection<UserReview> UserReviews { get; set; } = [];
}
