using AutoFixture.Xunit2;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Constants;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using Shouldly;
using System.Linq.Expressions;

namespace MysteryShopperService.BLL.Tests;

public class AuthServiceTests
{
    [Theory, AutoDomainData]
    public async Task LoginAsync_UserCredentialsAreValid_ReturnsTokenPair(
        [Frozen] IUserRepository userRepository,
        [Frozen] ITokenService tokenService,
        User user,
        AuthService sut,
        string email,
        string password)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password);
        user.Email = email;
        user.Password = hash;
        var pair = new TokenPair("access", "refresh");

        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns(user);
        tokenService.GetTokensAsync(user, Arg.Any<CancellationToken>()).Returns(pair);

        var result = await sut.LoginAsync(email, password);

        result.AccessToken.ShouldBe(pair.AccessToken);
        result.RefreshToken.ShouldBe(pair.RefreshToken);
        result.Role.ShouldBe(Role.User);
    }

    [Theory, AutoDomainData]
    public async Task LoginAsync_CompanyCredentialsAreValid_ReturnsTokenPair(
        [Frozen] IUserRepository userRepository,
        [Frozen] ICompanyRepository companyRepository,
        [Frozen] ITokenService tokenService,
        Company company,
        AuthService sut,
        string email,
        string password)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password);
        company.Email = email;
        company.Password = hash;
        var pair = new TokenPair("access", "refresh");

        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns((User?)null);
        companyRepository.GetAsync(Arg.Any<Expression<Func<Company, bool>>>(), true, Arg.Any<CancellationToken>())
                         .Returns(company);
        tokenService.GetTokensAsync(company, Arg.Any<CancellationToken>()).Returns(pair);

        var result = await sut.LoginAsync(email, password);

        result.AccessToken.ShouldBe(pair.AccessToken);
        result.RefreshToken.ShouldBe(pair.RefreshToken);
        result.Role.ShouldBe(Role.Company);
    }

    [Theory, AutoDomainData]
    public async Task LoginAsync_CredentialsAreInvalid_ThrowsUnauthorized(
        [Frozen] IUserRepository userRepository,
        [Frozen] ICompanyRepository companyRepository,
        AuthService sut,
        string email,
        string password)
    {
        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns((User?)null);
        companyRepository.GetAsync(Arg.Any<Expression<Func<Company, bool>>>(), true, Arg.Any<CancellationToken>())
                         .Returns((Company?)null);

        await Should.ThrowAsync<UnauthorizedException>(() => sut.LoginAsync(email, password));
    }

    [Theory, AutoDomainData]
    public async Task LoginAsync_CompanyPasswordIsInvalid_ThrowsUnauthorized(
        [Frozen] IUserRepository userRepository,
        [Frozen] ICompanyRepository companyRepository,
        AuthService sut,
        Company company,
        string email,
        string password)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password + "123");
        company.Email = email;
        company.Password = hash;

        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns((User?)null);
        companyRepository.GetAsync(Arg.Any<Expression<Func<Company, bool>>>(), true, Arg.Any<CancellationToken>())
                         .Returns(company);

        await Should.ThrowAsync<UnauthorizedException>(() => sut.LoginAsync(email, password));
    }

    [Theory, AutoDomainData]
    public async Task LoginAsync_UserPasswordIsInvalid_ThrowsUnauthorized(
        [Frozen] IUserRepository userRepository,
        [Frozen] ICompanyRepository companyRepository,
        AuthService sut,
        User user,
        string email,
        string password)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password + "123");
        user.Email = email;
        user.Password = hash;

        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns(user);
        companyRepository.GetAsync(Arg.Any<Expression<Func<Company, bool>>>(), true, Arg.Any<CancellationToken>())
                         .Returns((Company?)null);

        await Should.ThrowAsync<UnauthorizedException>(() => sut.LoginAsync(email, password));
    }

    [Theory, AutoDomainData]
    public async Task LogoutAsync_RemovesToken(
        [Frozen] ITokenService tokenService,
        AuthService sut,
        string refreshToken)
    {
        await sut.LogoutAsync(refreshToken);

        await tokenService.Received().RemoveRefreshTokenAsync(refreshToken, Arg.Any<CancellationToken>());
    }

    [Theory, AutoDomainData]
    public async Task RefreshTokensAsync_ValidToken_ReturnsNewPair(
        [Frozen] ITokenService tokenService,
        AuthService sut,
        string refreshToken,
        TokenPair pair)
    {
        tokenService.RefreshTokensAsync(refreshToken, Arg.Any<CancellationToken>()).Returns(pair);

        var result = await sut.RefreshTokensAsync(refreshToken);

        result.ShouldBe(pair);
    }

    [Theory, AutoDomainData]
    public async Task RegisterUser_EmailIsTaken_ThrowsBadRequest(
        [Frozen] IUserRepository userRepository,
        AuthService sut,
        UserRegistrationCredentials creds,
        User existingUser)
    {
        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns(existingUser);

        await Should.ThrowAsync<BadRequestException>(() => sut.RegisterUser(creds));
    }

    [Theory, AutoDomainData]
    public async Task RegisterUser_EmailIsFree_ReturnsAuthCredentials(
        [Frozen] IUserRepository userRepository,
        [Frozen] ITokenService tokenService,
        AuthService sut,
        UserRegistrationCredentials creds,
        User user)
    {
        var pair = new TokenPair("access", "refresh");

        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns((User?)null);
        userRepository.AddAsync(Arg.Any<User>(), Arg.Any<CancellationToken>())
            .Returns(user);
        tokenService.GetTokensAsync(Arg.Any<User>(), Arg.Any<CancellationToken>()).Returns(pair);

        var result = await sut.RegisterUser(creds);

        result.AccessToken.ShouldBe(pair.AccessToken);
        result.RefreshToken.ShouldBe(pair.RefreshToken);
        result.Role.ShouldBe(Role.User);
    }

    [Theory, AutoDomainData]
    public async Task RegisterCompany_EmailIsTaken_ThrowsBadRequest(
        [Frozen] ICompanyRepository companyRepository,
        AuthService sut,
        CompanyRegistrationCredentials creds,
        Company existingCompany)
    {
        companyRepository.GetAsync(Arg.Any<Expression<Func<Company, bool>>>(), true, Arg.Any<CancellationToken>())
                         .Returns(existingCompany);

        await Should.ThrowAsync<BadRequestException>(() => sut.RegisterCompany(creds));
    }

    [Theory, AutoDomainData]
    public async Task RegisterCompany_EmailIsFree_ReturnsAuthCredentials(
        [Frozen] ICompanyRepository companyRepository,
        [Frozen] ITokenService tokenService,
        AuthService sut,
        CompanyRegistrationCredentials creds,
        Company company)
    {
        var pair = new TokenPair("access", "refresh");

        companyRepository.GetAsync(Arg.Any<Expression<Func<Company, bool>>>(), true, Arg.Any<CancellationToken>())
                      .Returns((Company?)null);
        companyRepository.AddAsync(Arg.Any<Company>(), Arg.Any<CancellationToken>())
            .Returns(company);
        tokenService.GetTokensAsync(Arg.Any<Company>(), Arg.Any<CancellationToken>()).Returns(pair);

        var result = await sut.RegisterCompany(creds);

        result.AccessToken.ShouldBe(pair.AccessToken);
        result.RefreshToken.ShouldBe(pair.RefreshToken);
        result.Role.ShouldBe(Role.Company);
    }

    [Theory, AutoDomainData]
    public async Task IsEmailAvailableAsync_EmailNotTaken_ReturnsTrue(
        [Frozen] IUserRepository userRepository,
        [Frozen] ICompanyRepository companyRepository,
        AuthService sut,
        string email)
    {
        userRepository.ExistsAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<CancellationToken>())
                     .Returns(false);
        companyRepository.ExistsAsync(Arg.Any<Expression<Func<Company, bool>>>(), Arg.Any<CancellationToken>())
                         .Returns(false);

        var result = await sut.IsEmailAvailableAsync(email);

        result.ShouldBeTrue();
    }

    [Theory, AutoDomainData]
    public async Task IsEmailAvailableAsync_EmailTakenByUser_ReturnsFalse(
        [Frozen] IUserRepository userRepository,
        AuthService sut,
        string email)
    {
        userRepository.ExistsAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<CancellationToken>())
                     .Returns(true);

        var result = await sut.IsEmailAvailableAsync(email);

        result.ShouldBeFalse();
    }
}
