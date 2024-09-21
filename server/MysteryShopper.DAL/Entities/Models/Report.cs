using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Report
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public short Grade { get; set; }

    public int? UserId { get; set; }

    public int? OrderId { get; set; }

    public virtual Order? Order { get; set; }

    public virtual User? User { get; set; }

    public virtual ICollection<UserReview> UserReviews { get; set; } = new List<UserReview>();
}
