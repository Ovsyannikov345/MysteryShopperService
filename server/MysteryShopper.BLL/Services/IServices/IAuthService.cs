using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IAuthService
    {
        Task<AuthCredentials> LoginAsync(string email, string password, CancellationToken cancellationToken = default);

        Task LogoutAsync(string refreshToken, CancellationToken cancellationToken = default);

        Task<TokenPair> RefreshTokensAsync(string refreshToken, CancellationToken cancellationToken = default);

        Task<AuthCredentials> RegisterCompany(CompanyRegistrationCredentials companyData, CancellationToken cancellationToken = default);

        Task<AuthCredentials> RegisterUser(UserRegistrationCredentials userData, CancellationToken cancellationToken = default);

        Task<bool> IsEmailAvailableAsync(string email, CancellationToken cancellationToken = default);
    }
}