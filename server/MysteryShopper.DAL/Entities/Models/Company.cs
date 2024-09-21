using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Company
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ContactPerson> ContactPeople { get; set; } = new List<ContactPerson>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<SupportRequest> SupportRequests { get; set; } = new List<SupportRequest>();

    public virtual ICollection<UserReview> UserReviews { get; set; } = new List<UserReview>();
}
