using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Order : EntityBase
{
    [MaxLength(100)]
    public required string Title { get; set; }

    [Column(TypeName = "text")]
    public required string Description { get; set; }

    [MaxLength(255)]
    public string? Place { get; set; }

    public TimeSpan? TimeToComplete { get; set; }

    public int? Price { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }

    public bool IsClosed { get; set; }

    public Guid CompanyId { get; set; }

    public required virtual Company Company { get; set; }

    public virtual ICollection<UserOrder> Users { get; set; } = [];

    public virtual ICollection<Report> Reports { get; set; } = [];

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = [];

    public virtual ICollection<UserReview> UserReviews { get; set; } = [];
}
