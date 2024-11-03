namespace MysteryShopper.API.ViewModels
{
    public class CompanyToUpdateViewModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ContactPersonToUpdateViewModel ContactPerson { get; set; } = null!;
    }
}
