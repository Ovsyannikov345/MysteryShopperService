using AutoFixture.Xunit2;
using AutoMapper;
using FluentValidation.Results;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using Shouldly;

namespace MysteryShopperService.BLL.Tests;

public class ReportServiceTests
{
    private readonly CancellationToken cancellationToken = CancellationToken.None;

    private readonly IMapper mapper = new MapperConfiguration(cfg => cfg.AddProfiles([new AutoMapperProfile()])).CreateMapper();

    [Theory, AutoDomainData]
    public async Task CreateReportAsync_StatusNotFound_ThrowsForbiddenException(
        [Frozen] IReportRepository reportRepository,
        [Frozen] IUserOrderRepository userOrderRepository,
        ReportService reportService,
        ReportModel report)
    {
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), cancellationToken)
            .Returns((UserOrder?)null);

        await reportService.CreateReportAsync(report, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateReportAsync_StatusNotInProgress_ThrowsForbiddenException(
        [Frozen] IReportRepository reportRepository,
        [Frozen] IUserOrderRepository userOrderRepository,
        ReportService reportService,
        UserOrder userOrder,
        ReportModel report)
    {
        userOrder.Status = UserOrderStatus.Requested;

        userOrderRepository.GetUserOrderAsync(userOrder.Id, cancellationToken)
            .Returns(userOrder);

        await reportService.CreateReportAsync(report, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateReportAsync_ValidFlow_CreatesReport(
        [Frozen] IReportRepository reportRepository,
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] INotificationService notificationService,
        ReportService reportService,
        UserOrder userOrder,
        ReportModel report)
    {
        userOrder.Status = UserOrderStatus.InProgress;

        var createdReport = mapper.Map<Report>(report);

        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns(userOrder);
        reportRepository.AddAsync(Arg.Any<Report>(), cancellationToken)
            .Returns(createdReport);

        var result = await reportService.CreateReportAsync(report, cancellationToken);

        result.ShouldBeEquivalentTo(report);
        notificationService.Received(1).CreateNotificationAsync(Arg.Any<NotificationModel>(), cancellationToken);
    }
}
