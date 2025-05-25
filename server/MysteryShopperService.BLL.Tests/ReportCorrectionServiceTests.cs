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
using System.Threading;

namespace MysteryShopperService.BLL.Tests;

public class ReportCorrectionServiceTests
{
    private readonly CancellationToken cancellationToken = CancellationToken.None;

    private readonly IMapper mapper = new MapperConfiguration(cfg => cfg.AddProfiles([new AutoMapperProfile()])).CreateMapper();

    [Theory, AutoDomainData]
    public async Task CreateReportCorrectionAsync_InvalidReportCorrection_ThrowsBadRequestException(
        ReportCorrectionService reportCorrectionService,
        ReportCorrectionModel reportCorrection)
    {
        reportCorrection.Description = "";

        await reportCorrectionService.CreateReportCorrectionAsync(reportCorrection, Guid.NewGuid(), cancellationToken).ShouldThrowAsync<BadRequestException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateReportCorrectionAsync_ReportNotFound_ThrowsNotFoundException(
        [Frozen] IReportRepository reportRepository,
        ReportCorrectionService reportCorrectionService,
        ReportCorrectionModel reportCorrection)
    {
        reportRepository.GetReportDetailsAsync(reportCorrection.ReportId, cancellationToken)
            .Returns((Report?)null);

        await reportCorrectionService.CreateReportCorrectionAsync(reportCorrection, Guid.NewGuid(), cancellationToken).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateReportCorrectionAsync_NowOwnOrder_ThrowsForbiddenException(
        [Frozen] IReportRepository reportRepository,
        ReportCorrectionService reportCorrectionService,
        Report report,
        ReportCorrectionModel reportCorrection)
    {
        reportRepository.GetReportDetailsAsync(reportCorrection.ReportId, cancellationToken)
            .Returns(report);

        await reportCorrectionService.CreateReportCorrectionAsync(reportCorrection, Guid.NewGuid(), cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateReportCorrectionAsync_ReportHasCorrection_ThrowsBadRequestException(
        [Frozen] IReportRepository reportRepository,
        ReportCorrectionService reportCorrectionService,
        Report report,
        ReportCorrectionModel reportCorrection)
    {
        reportRepository.GetReportDetailsAsync(reportCorrection.ReportId, cancellationToken)
            .Returns(report);

        await reportCorrectionService.CreateReportCorrectionAsync(reportCorrection, report.Order.CompanyId, cancellationToken).ShouldThrowAsync<BadRequestException>();
    }


    [Theory, AutoDomainData]
    public async Task CreateReportCorrectionAsync_ValidFlow_CreatesCorrection(
        [Frozen] IReportRepository reportRepository,
        [Frozen] IReportCorrectionRepository reportCorrectionRepository,
        [Frozen] INotificationService notificationService,
        ReportCorrectionService reportCorrectionService,
        Report report,
        ReportCorrectionModel reportCorrection)
    {
        report.ReportCorrection = null;

        var createdCorrection = mapper.Map<ReportCorrection>(reportCorrection);

        reportRepository.GetReportDetailsAsync(reportCorrection.ReportId, cancellationToken)
            .Returns(report);
        reportCorrectionRepository.AddAsync(Arg.Any<ReportCorrection>(), cancellationToken)
            .Returns(createdCorrection);

        var result = await reportCorrectionService.CreateReportCorrectionAsync(reportCorrection, report.Order.CompanyId, cancellationToken);

        result.ShouldBeEquivalentTo(reportCorrection);
        notificationService.Received(1).CreateNotificationAsync(Arg.Any<NotificationModel>(), cancellationToken);
    }
}
