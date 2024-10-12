namespace MysteryShopper.BLL.Dto
{
    public class ContactPersonToUpdateModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string? Patronymic { get; set; }

        public string Phone { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
    }
}
