using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class UserProfileViewModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public DateTime? BirthDate { get; set; }

        public GenderType Gender { get; set; }

        public string? WorkingExperience { get; set; }

        public string? City { get; set; }

        public string Phone { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public virtual IEnumerable<UserOrder> Orders { get; set; } = [];

        public virtual IEnumerable<UserReview> UserReviews { get; set; } = [];
    }
}
