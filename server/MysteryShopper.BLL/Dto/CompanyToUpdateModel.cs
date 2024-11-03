
namespace MysteryShopper.BLL.Dto
{
    public class CompanyToUpdateModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ContactPersonToUpdateModel ContactPerson { get; set; } = null!;
    }
}
