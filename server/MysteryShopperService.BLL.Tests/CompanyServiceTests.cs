using AutoFixture.Xunit2;
using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using Shouldly;
using System.Linq.Expressions;

namespace MysteryShopperService.BLL.Tests;

public class CompanyServiceTests
{
    [Theory, AutoDomainData]
    public async Task GetProfileAsync_CompanyExists_ReturnsCompany(
        [Frozen] ICompanyRepository companyRepository,
        CompanyService sut,
        Company company)
    {
        companyRepository.GetCompanyWithReviewsAsync(
                Arg.Any<Expression<Func<Company, bool>>>(),
                Arg.Any<CancellationToken>())
            .Returns(company);

        var result = await sut.GetProfileAsync(company.Id);

        result.ShouldBe(company);
    }

    [Theory, AutoDomainData]
    public async Task GetProfileAsync_CompanyNotFound_ThrowsNotFound(
        [Frozen] ICompanyRepository companyRepository,
        CompanyService sut,
        Guid id)
    {
        companyRepository.GetCompanyWithReviewsAsync(
                Arg.Any<Expression<Func<Company, bool>>>(),
                Arg.Any<CancellationToken>())
            .Returns((Company?)null);

        await Should.ThrowAsync<NotFoundException>(() => sut.GetProfileAsync(id));
    }

    [Theory, AutoDomainData]
    public async Task UpdateProfileInfoAsync_DifferentCallerId_ThrowsForbidden(
        CompanyService sut,
        CompanyToUpdateModel model)
    {
        var callerId = Guid.Empty;

        await Should.ThrowAsync<ForbiddenException>(() =>
            sut.UpdateProfileInfoAsync(callerId, model));
    }

    [Theory, AutoDomainData]
    public async Task UpdateProfileInfoAsync_CompanyNotFound_ThrowsNotFound(
        [Frozen] ICompanyRepository companyRepository,
        CompanyService sut,
        CompanyToUpdateModel model)
    {
        companyRepository.GetAsync(
                Arg.Any<Expression<Func<Company, bool>>>(),
                false,
                Arg.Any<CancellationToken>())
            .Returns((Company?)null);

        await Should.ThrowAsync<NotFoundException>(() =>
            sut.UpdateProfileInfoAsync(model.Id, model));
    }

    [Theory, AutoDomainData]
    public async Task UpdateProfileInfoAsync_ValidData_UpdatesAndReturnsNewProfile(
        [Frozen] ICompanyRepository companyRepository,
        CompanyService sut,
        Company company,
        CompanyToUpdateModel model)
    {
        company.Name = "Old name";
        model.Name = "New name";

        companyRepository.GetAsync(
                Arg.Any<Expression<Func<Company, bool>>>(),
                false,
                Arg.Any<CancellationToken>())
            .Returns(company);

        companyRepository.UpdateAsync(Arg.Any<Company>(), Arg.Any<CancellationToken>())
                         .Returns(company);

        companyRepository.GetCompanyWithReviewsAsync(
                Arg.Any<Expression<Func<Company, bool>>>(),
                Arg.Any<CancellationToken>())
            .Returns(company);

        var result = await sut.UpdateProfileInfoAsync(model.Id, model);

        await companyRepository.Received()
            .UpdateAsync(company, Arg.Any<CancellationToken>());

        result.Name.ShouldBe("New name");
    }
}
