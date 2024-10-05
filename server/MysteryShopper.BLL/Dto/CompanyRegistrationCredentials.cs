namespace MysteryShopper.BLL.Dto
{
    public record CompanyRegistrationCredentials(string Name, string Email, string Password, CompanyContactPersonCredentials CompanyContactPerson)
    {
    }
}
