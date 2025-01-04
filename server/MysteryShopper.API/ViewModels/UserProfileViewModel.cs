using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels;

public class UserProfileViewModel
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Surname { get; set; }

    public DateTime? BirthDate { get; set; }

    public GenderType Gender { get; set; }

    public string? WorkingExperience { get; set; }

    public string? City { get; set; }

    public required string Phone { get; set; }

    public required string Email { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public IEnumerable<UserOrder> Orders { get; set; } = [];

    public IEnumerable<UserReview> UserReviews { get; set; } = [];
}
