using AutoFixture.Xunit2;
using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using Shouldly;
using System.Linq.Expressions;

namespace MysteryShopperService.BLL.Tests;

public class SupportRequestServiceTests
{
    private readonly CancellationToken cancellationToken = CancellationToken.None;

    private readonly IMapper mapper = new MapperConfiguration(cfg => cfg.AddProfiles([new AutoMapperProfile()])).CreateMapper();

    [Theory, AutoDomainData]
    public async Task CreateSupportRequestAsync_SenderNotFound_Throws(
        [Frozen] IUserRepository userRepository,
        [Frozen] ICompanyRepository companyRepository,
        SupportRequestService supportRequestService,
        SupportRequestModel supportRequest)
    {
        userRepository.ExistsAsync(Arg.Any<Expression<Func<User, bool>>>(), cancellationToken)
            .Returns(false);
        companyRepository.ExistsAsync(Arg.Any<Expression<Func<Company, bool>>>(), cancellationToken)
            .Returns(false);

        await supportRequestService.CreateSupportRequestAsync(supportRequest, cancellationToken).ShouldThrowAsync<BadRequestException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateSupportRequestAsync_ValidFlow_CreatesSupportRequest(
        [Frozen] IUserRepository userRepository,
        [Frozen] ICompanyRepository companyRepository,
        [Frozen] ISupportRequestRepository supportRequestRepository,
        SupportRequestService supportRequestService,
        SupportRequestModel supportRequest)
    {
        var createdRequest = mapper.Map<SupportRequest>(supportRequest);

        userRepository.ExistsAsync(Arg.Any<Expression<Func<User, bool>>>(), cancellationToken)
            .Returns(true);
        companyRepository.ExistsAsync(Arg.Any<Expression<Func<Company, bool>>>(), cancellationToken)
            .Returns(true);
        supportRequestRepository.AddAsync(Arg.Any<SupportRequest>(), cancellationToken)
            .Returns(createdRequest);

        var result = await supportRequestService.CreateSupportRequestAsync(supportRequest, cancellationToken);

        result.ShouldBeEquivalentTo(supportRequest);
    }
}
