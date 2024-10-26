using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class SupportRequestViewModel
    {
        public Guid Id { get; set; }

        public string? Text { get; set; }

        public DateTime CreatedAt { get; set; }

        public Guid? UserId { get; set; }

        public Guid? CompanyId { get; set; }

        public Company? Company { get; set; }

        public User? User { get; set; }
    }
}
