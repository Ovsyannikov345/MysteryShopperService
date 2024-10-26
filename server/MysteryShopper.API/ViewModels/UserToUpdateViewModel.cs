using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.API.ViewModels
{
    public class UserToUpdateViewModel
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
    }
}
