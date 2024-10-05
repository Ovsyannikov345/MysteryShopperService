using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Constants;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;
using System.Security.Claims;
using System.Text;

namespace MysteryShopper.BLL.Services
{
    public class TokenService(IConfiguration configuration, IRefreshTokenRepository refreshTokenRepository, ILogger logger) : ITokenService
    {
        private readonly IConfiguration _configuration = configuration;

        private readonly IRefreshTokenRepository _refreshTokenRepository = refreshTokenRepository;

        private readonly ILogger _logger = logger;

        public async Task<TokenPair> GetTokensAsync(User user, CancellationToken cancellationToken = default)
        {
            var claims = GetClaims(user);

            TokenPair tokens = await CreateTokensAsync(claims, cancellationToken);

            _logger.Information("Tokens created for user {0}", user.Id);

            return tokens;
        }

        public async Task<TokenPair> GetTokensAsync(Company company, CancellationToken cancellationToken = default)
        {
            var claims = GetClaims(company);

            TokenPair tokens = await CreateTokensAsync(claims, cancellationToken);

            _logger.Information("Tokens created for company {0}", company.Id);

            return tokens;
        }

        public async Task<TokenPair> RefreshTokensAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            var refreshTokenEntity = await _refreshTokenRepository.GetByItemAsync(token => token.Token == refreshToken, cancellationToken)
                ?? throw new NotFoundException("Provided refresh token is not found");

            var tokenHandler = new JsonWebTokenHandler();

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:RefreshSecretKey"]!)),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudiences = _configuration.GetSection("Jwt:Audiences").Get<string[]>(),
                ValidateLifetime = true,
            };

            TokenValidationResult validationResult = await tokenHandler.ValidateTokenAsync(refreshTokenEntity.Token, tokenValidationParameters);

            if (!validationResult.IsValid)
            {
                _logger.Information("Failed to refresh tokens. Exception: {0}", validationResult.Exception.Message);
                _logger.Information("Provided token: {0}", refreshTokenEntity.Token);

                await _refreshTokenRepository.DeleteAsync(refreshTokenEntity.Id, cancellationToken);

                throw new ForbiddenException("Provided refresh token is invalid");
            }

            string newAccessToken = GenerateToken(validationResult.ClaimsIdentity.Claims,
                DateTime.Now.AddMinutes(int.Parse(_configuration["Jwt:AccessMinutesExpire"]!)),
                _configuration["Jwt:AccessSecretKey"]!);

            string newRefreshToken = GenerateToken(validationResult.ClaimsIdentity.Claims,
                DateTime.Now.AddDays(int.Parse(_configuration["Jwt:RefreshDaysExpire"]!)),
                _configuration["Jwt:RefreshSecretKey"]!);

            try
            {
                await _refreshTokenRepository.DeleteAsync(refreshTokenEntity.Id, cancellationToken);
                await _refreshTokenRepository.AddAsync(new RefreshToken() { Token = newRefreshToken }, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error during token change");

                throw new InternalServerErrorException("Error while changing refresh token in database");
            }

            _logger.Information("Tokens refreshed for user {0}", validationResult.ClaimsIdentity.Name);

            return new TokenPair(newAccessToken, newRefreshToken);
        }

        public async Task RemoveRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            var token = await _refreshTokenRepository.GetByItemAsync(t => t.Token == refreshToken, cancellationToken);

            if (token == null)
            {
                _logger.Error("Provided refresh token is not found");
                throw new NotFoundException("Provided refresh token is not found");
            }

            await _refreshTokenRepository.DeleteAsync(token.Id, cancellationToken);
            _logger.Information("Refresh token removed for user");
        }

        private async Task<TokenPair> CreateTokensAsync(List<Claim> claims, CancellationToken cancellationToken = default)
        {
            var accessToken = GenerateToken(claims,
                DateTime.Now.AddMinutes(int.Parse(_configuration["Jwt:AccessMinutesExpire"]!)),
                _configuration["Jwt:AccessSecretKey"]!);

            var refreshToken = GenerateToken(claims,
                DateTime.Now.AddDays(int.Parse(_configuration["Jwt:RefreshDaysExpire"]!)),
                _configuration["Jwt:RefreshSecretKey"]!);

            try
            {
                await _refreshTokenRepository.AddAsync(new RefreshToken() { Token = refreshToken }, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error during token save");

                throw new InternalServerErrorException("Error while saving new refresh token");
            }

            return new TokenPair(accessToken, refreshToken);
        }

        private string GenerateToken(IEnumerable<Claim> claims, DateTime expirationDate, string secretKey)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expirationDate,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration.GetSection("Jwt:Audiences:0").Value,
                SigningCredentials = credentials
            };

            var tokenHandler = new JsonWebTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return token;
        }

        private static List<Claim> GetClaims(User user)
        {
            var claims = new List<Claim>()
            {
                new("Id", user.Id.ToString()),
                new(ClaimTypes.Role, Roles.User.ToString()),
                new(JwtRegisteredClaimNames.Sub, user.Email),
            };

            return claims;
        }

        private static List<Claim> GetClaims(Company company)
        {
            var claims = new List<Claim>()
            {
                new("Id", company.Id.ToString()),
                new(ClaimTypes.Role, Roles.Company.ToString()),
                new(JwtRegisteredClaimNames.Sub, company.Email),
            };

            return claims;
        }
    }
}
