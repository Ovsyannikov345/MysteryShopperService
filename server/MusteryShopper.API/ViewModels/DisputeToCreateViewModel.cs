using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels
{
    public class DisputeToCreateViewModel
    {
        public string? CompanyText { get; set; }

        public string? UserText { get; set; }

        public Guid OrderId { get; set; }

        public Guid UserId { get; set; }
    }
}
