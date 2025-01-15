using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Dto;

public class OrderModel
{
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public required string Place { get; set; }

    public TimeSpan? TimeToComplete { get; set; }

    public int? Price { get; set; }

    public DateTime CreatedAt { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }

    public bool IsClosed { get; set; }

    public Guid CompanyId { get; set; }

    public virtual ICollection<UserOrder> Users { get; set; } = [];

    public virtual ICollection<Report> Reports { get; set; } = [];

    public virtual ICollection<Dispute> Disputes { get; set; } = [];

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = [];

    public virtual ICollection<UserReview> UserReviews { get; set; } = [];

    public virtual ICollection<OrderTag> Tags { get; set; } = [];
}
