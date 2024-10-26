using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class ReviewViewModel
    {
        public Guid Id { get; set; }

        public string? Text { get; set; }

        public short Grade { get; set; }

        public DateTime CreatedAt { get; set; }

        public Guid UserId { get; set; }

        public Guid OrderId { get; set; }

        public Guid CompanyId { get; set; }

        public required Order Order { get; set; }

        public required User User { get; set; }

        public required Company Company { get; set; }
    }
}
