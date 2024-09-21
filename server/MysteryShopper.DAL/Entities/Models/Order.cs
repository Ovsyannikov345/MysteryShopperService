using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Order
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string Place { get; set; } = null!;

    public short? CompletionTime { get; set; }

    public int? Price { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? CompanyId { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }

    public virtual Company? Company { get; set; }

    public virtual ICollection<CompanyReview> CompanyReviews { get; set; } = new List<CompanyReview>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
