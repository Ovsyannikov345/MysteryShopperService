using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IAuthService
    {
        Task<TokenPair> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
        Task LogoutAsync(string refreshToken, CancellationToken cancellationToken = default);
        Task<TokenPair> RegisterCompany(CompanyRegistrationCredentials companyData, CancellationToken cancellationToken = default);
        Task<TokenPair> RegisterUser(UserRegistrationCredentials userData, CancellationToken cancellationToken = default);
    }
}