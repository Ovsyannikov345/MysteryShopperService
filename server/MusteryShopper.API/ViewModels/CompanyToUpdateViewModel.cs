namespace MysteryShopper.API.ViewModels
{
    public class CompanyToUpdateViewModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public virtual ContactPersonToUpdateViewModel ContactPerson { get; set; } = null!;
    }
}
