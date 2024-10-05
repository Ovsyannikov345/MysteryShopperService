using MysteryShopper.BLL.Dto;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface ITokenService
    {
        Task<TokenPair> GetTokensAsync(Company company, CancellationToken cancellationToken = default);

        Task<TokenPair> GetTokensAsync(User user, CancellationToken cancellationToken = default);

        Task<TokenPair> RefreshTokensAsync(string refreshToken, CancellationToken cancellationToken = default);

        Task RemoveRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    }
}