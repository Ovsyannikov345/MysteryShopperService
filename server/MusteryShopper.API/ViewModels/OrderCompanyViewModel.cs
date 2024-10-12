using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class OrderCompanyViewModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateTime? CreatedAt { get; set; }

        public IEnumerable<OrderCompanyReviewViewModel> CompanyReviews { get; set; } = [];
    }
}
