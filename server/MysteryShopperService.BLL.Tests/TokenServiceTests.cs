using AutoFixture.Xunit2;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Constants;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;

namespace MysteryShopperService.BLL.Tests;

public class TokenServiceTests
{
    private readonly CancellationToken cancellationToken = CancellationToken.None;

    [Theory, AutoDomainData]
    public async Task GetTokensAsync_TokenSaveFailed_Throws(
        [Frozen] IRefreshTokenRepository refreshTokenRepository,
        TokenService tokenService,
        User user)
    {
        refreshTokenRepository.AddAsync(Arg.Any<RefreshToken>(), cancellationToken)
            .Throws(new InternalServerErrorException("error"));

        await tokenService.GetTokensAsync(user, cancellationToken).ShouldThrowAsync<InternalServerErrorException>();
    }

    [Theory, AutoDomainData]
    public async Task GetTokensAsync_ValidUserFlow_ReturnsTokens(
        TokenService tokenService,
        User user)
    {
        var result = await tokenService.GetTokensAsync(user, cancellationToken);

        result.AccessToken.ShouldNotBeNullOrWhiteSpace();
        result.RefreshToken.ShouldNotBeNullOrWhiteSpace();
    }

    [Theory, AutoDomainData]
    public async Task GetTokensAsync_ValidCompanyFlow_ReturnsTokens(
        TokenService tokenService,
        Company company)
    {
        var result = await tokenService.GetTokensAsync(company, cancellationToken);

        result.AccessToken.ShouldNotBeNullOrWhiteSpace();
        result.RefreshToken.ShouldNotBeNullOrWhiteSpace();
    }

    [Theory, AutoDomainData]
    public async Task RefreshTokensAsync_RefreshTokenNotFound_Throws(
        [Frozen] IRefreshTokenRepository refreshTokenRepository,
        TokenService tokenService,
        string refreshToken)
    {
        refreshTokenRepository.GetAsync(Arg.Any<Expression<Func<RefreshToken, bool>>>(), disableTracking: false, cancellationToken)
            .Returns((RefreshToken?)null);

        await tokenService.RefreshTokensAsync(refreshToken, cancellationToken).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task RefreshTokensAsync_InvalidToken_Throws(
        [Frozen] IRefreshTokenRepository refreshTokenRepository,
        TokenService tokenService,
        string refreshToken,
        RefreshToken refreshTokenEntity)
    {
        refreshTokenRepository.GetAsync(Arg.Any<Expression<Func<RefreshToken, bool>>>(), disableTracking: false, cancellationToken)
            .Returns(refreshTokenEntity);

        await tokenService.RefreshTokensAsync(refreshToken, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task RefreshTokensAsync_TokenChangeError_Throws(
        [Frozen] IConfiguration configuration,
        [Frozen] IRefreshTokenRepository refreshTokenRepository,
        TokenService tokenService,
        RefreshToken refreshTokenEntity,
        User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:RefreshSecretKey"]!));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new("Id", user.Id.ToString()),
                new(ClaimTypes.Role, Role.User.ToString()),
                new(JwtRegisteredClaimNames.Sub, user.Email)
            ]),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(configuration["Jwt:AccessMinutesExpire"]!)),
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration.GetSection("Jwt:Audiences").Get<string[]>()![0],
            SigningCredentials = credentials
        };

        var tokenHandler = new JsonWebTokenHandler();

        var refreshToken = tokenHandler.CreateToken(tokenDescriptor);

        refreshTokenEntity.Token = refreshToken;

        refreshTokenRepository.GetAsync(Arg.Any<Expression<Func<RefreshToken, bool>>>(), disableTracking: false, cancellationToken)
            .Returns(refreshTokenEntity);
        refreshTokenRepository.DeleteAsync(Arg.Any<Guid>(), cancellationToken)
            .Throws(new InternalServerErrorException("error"));

        await tokenService.RefreshTokensAsync(refreshToken, cancellationToken).ShouldThrowAsync<InternalServerErrorException>();
    }

    [Theory, AutoDomainData]
    public async Task RefreshTokensAsync_ValidFlow_ReturnsTokens(
        [Frozen] IConfiguration configuration,
        [Frozen] IRefreshTokenRepository refreshTokenRepository,
        TokenService tokenService,
        RefreshToken refreshTokenEntity,
        User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:RefreshSecretKey"]!));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new("Id", user.Id.ToString()),
                new(ClaimTypes.Role, Role.User.ToString()),
                new(JwtRegisteredClaimNames.Sub, user.Email)
            ]),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(configuration["Jwt:AccessMinutesExpire"]!)),
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration.GetSection("Jwt:Audiences").Get<string[]>()![0],
            SigningCredentials = credentials
        };

        var tokenHandler = new JsonWebTokenHandler();

        var refreshToken = tokenHandler.CreateToken(tokenDescriptor);

        refreshTokenEntity.Token = refreshToken;

        refreshTokenRepository.GetAsync(Arg.Any<Expression<Func<RefreshToken, bool>>>(), disableTracking: false, cancellationToken)
            .Returns(refreshTokenEntity);

        var result = await tokenService.RefreshTokensAsync(refreshToken, cancellationToken);

        result.AccessToken.ShouldNotBeNullOrWhiteSpace();
        result.RefreshToken.ShouldNotBeNullOrWhiteSpace();
    }

    [Theory, AutoDomainData]
    public async Task RemoveRefreshTokenAsync_TokenNotFound_Throws(
        [Frozen] IRefreshTokenRepository refreshTokenRepository,
        TokenService tokenService)
    {
        refreshTokenRepository.GetAsync(Arg.Any<Expression<Func<RefreshToken, bool>>>(), disableTracking: false, cancellationToken)
            .Returns((RefreshToken?)null);

        await tokenService.RemoveRefreshTokenAsync("token", cancellationToken).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task RemoveRefreshTokenAsync_ValidFlow_RemovesToken(
        [Frozen] IRefreshTokenRepository refreshTokenRepository,
        TokenService tokenService,
        RefreshToken refreshToken)
    {
        refreshTokenRepository.GetAsync(Arg.Any<Expression<Func<RefreshToken, bool>>>(), disableTracking: false, cancellationToken)
            .Returns(refreshToken);

        await tokenService.RemoveRefreshTokenAsync(refreshToken.Token, cancellationToken);

        await refreshTokenRepository.Received(1).DeleteAsync(refreshToken.Id, cancellationToken);
    }
}
