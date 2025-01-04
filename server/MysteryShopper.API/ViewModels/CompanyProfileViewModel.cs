using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels;

public class CompanyProfileViewModel
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public DateTime? CreatedAt { get; set; }

    public required ContactPersonViewModel ContactPerson { get; set; }

    public IEnumerable<Order> Orders { get; set; } = [];

    public IEnumerable<CompanyReview> CompanyReviews { get; set; } = [];
}
