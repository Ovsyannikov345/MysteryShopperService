using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class CompanyProfileViewModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateTime? CreatedAt { get; set; }

        public ContactPersonViewModel ContactPerson { get; set; } = null!;

        public IEnumerable<Order> Orders { get; set; } = [];

        public IEnumerable<CompanyReview> CompanyReviews { get; set; } = [];
    }
}
