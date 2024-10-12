using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class CompanyProfileViewModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateTime? CreatedAt { get; set; }

        public virtual ContactPersonViewModel ContactPerson { get; set; } = null!;

        public virtual IEnumerable<Order> Orders { get; set; } = [];

        public virtual IEnumerable<CompanyReview> CompanyReviews { get; set; } = [];
    }
}
