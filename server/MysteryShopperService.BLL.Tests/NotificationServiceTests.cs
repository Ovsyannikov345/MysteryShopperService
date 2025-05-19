using AutoFixture.Xunit2;
using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Serilog;
using Shouldly;
using System.Linq.Expressions;

namespace MysteryShopperService.BLL.Tests;

public class NotificationServiceTests
{
    [Theory, AutoDomainData]
    public async Task CreateNotificationAsync_ValidData_CallsRepositoryAdd(
        NotificationModel dto,
        NotificationService sut)
    {
        await sut.CreateNotificationAsync(dto).ShouldNotThrowAsync();
    }

    [Theory, AutoDomainData]
    public async Task CreateNotificationAsync_RepositoryThrows_LogsError(
        [Frozen] INotificationRepository notificationRepository,
        [Frozen] ILogger logger,
        NotificationModel dto,
        Exception ex,
        NotificationService sut)
    {
        notificationRepository
            .AddAsync(Arg.Any<Notification>(), Arg.Any<CancellationToken>())
            .ThrowsForAnyArgs(ex);

        await sut.CreateNotificationAsync(dto).ShouldNotThrowAsync();
        logger.ReceivedWithAnyArgs().Error(Arg.Any<Exception>(), Arg.Any<string>());
    }

    [Theory, AutoDomainData]
    public async Task GetCompanyNotificationsAsync_ReturnsMappedCollection(
        [Frozen] INotificationRepository notificationRepository,
        Guid companyId,
        List<Notification> entities,
        NotificationService sut)
    {
        notificationRepository
            .GetCompanyNotifications(companyId, Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(entities);

        var result = await sut.GetCompanyNotificationsAsync(companyId);

        result.Count().ShouldBeEquivalentTo(entities.Count);
    }

    [Theory, AutoDomainData]
    public async Task GetUserNotificationsAsync_ReturnsMappedCollection(
        [Frozen] INotificationRepository notificationRepository,
        Guid userId,
        List<Notification> entities,
        NotificationService sut)
    {
        notificationRepository
            .GetUserNotifications(userId, Arg.Any<int>(), Arg.Any<CancellationToken>())
            .Returns(entities);

        var result = await sut.GetUserNotificationsAsync(userId);

        result.Count().ShouldBeEquivalentTo(entities.Count);
    }

    [Theory, AutoDomainData]
    public async Task ReadCompanyNotificationAsync_NotificationMissing_ThrowsNotFound(
        [Frozen] INotificationRepository notificationRepository,
        NotificationService sut,
        Guid notificationId,
        Guid companyId)
    {
        notificationRepository.GetAsync(
                Arg.Any<Expression<Func<Notification, bool>>>(),
                true,
                Arg.Any<CancellationToken>())
            .Returns((Notification?)null);

        await Should.ThrowAsync<NotFoundException>(() =>
            sut.ReadCompanyNotificationAsync(notificationId, companyId));
    }

    [Theory, AutoDomainData]
    public async Task ReadCompanyNotificationAsync_WrongCompany_ThrowsForbidden(
        [Frozen] INotificationRepository notificationRepository,
        NotificationService sut,
        Guid companyId,
        Notification notification)
    {
        notification.CompanyId = Guid.NewGuid();
        notification.IsRead = false;

        notificationRepository.GetAsync(
                Arg.Any<Expression<Func<Notification, bool>>>(),
                true,
                Arg.Any<CancellationToken>())
            .Returns(notification);

        await Should.ThrowAsync<ForbiddenException>(() =>
            sut.ReadCompanyNotificationAsync(notification.Id, companyId));
    }

    [Theory, AutoDomainData]
    public async Task ReadCompanyNotificationAsync_Valid_SetsIsReadAndUpdates(
        [Frozen] INotificationRepository notificationRepository,
        NotificationService sut,
        Guid companyId,
        Notification notification)
    {
        notification.CompanyId = companyId;
        notification.IsRead = false;

        notificationRepository.GetAsync(
                Arg.Any<Expression<Func<Notification, bool>>>(),
                true,
                Arg.Any<CancellationToken>())
            .Returns(notification);

        await sut.ReadCompanyNotificationAsync(notification.Id, companyId);

        notification.IsRead.ShouldBeTrue();
        await notificationRepository.Received()
                                    .UpdateAsync(notification, Arg.Any<CancellationToken>());
    }

    [Theory, AutoDomainData]
    public async Task ReadUserNotificationAsync_NotificationMissing_ThrowsNotFound(
        [Frozen] INotificationRepository notificationRepository,
        NotificationService sut,
        Guid notificationId,
        Guid userId)
    {
        notificationRepository.GetAsync(
                Arg.Any<Expression<Func<Notification, bool>>>(),
                true,
                Arg.Any<CancellationToken>())
            .Returns((Notification?)null);

        await Should.ThrowAsync<NotFoundException>(() =>
            sut.ReadUserNotificationAsync(notificationId, userId));
    }

    [Theory, AutoDomainData]
    public async Task ReadUserNotificationAsync_WrongUser_ThrowsForbidden(
        [Frozen] INotificationRepository notificationRepository,
        NotificationService sut,
        Guid userId,
        Notification notification)
    {
        notification.UserId = Guid.NewGuid();
        notification.IsRead = false;

        notificationRepository.GetAsync(
                Arg.Any<Expression<Func<Notification, bool>>>(),
                true,
                Arg.Any<CancellationToken>())
            .Returns(notification);

        await Should.ThrowAsync<ForbiddenException>(() =>
            sut.ReadUserNotificationAsync(notification.Id, userId));
    }

    [Theory, AutoDomainData]
    public async Task ReadUserNotificationAsync_Valid_SetsIsReadAndUpdates(
        [Frozen] INotificationRepository notificationRepository,
        NotificationService sut,
        Guid userId,
        Notification notification)
    {
        notification.UserId = userId;
        notification.IsRead = false;

        notificationRepository.GetAsync(
                Arg.Any<Expression<Func<Notification, bool>>>(),
                true,
                Arg.Any<CancellationToken>())
            .Returns(notification);

        await sut.ReadUserNotificationAsync(notification.Id, userId);

        notification.IsRead.ShouldBeTrue();
        await notificationRepository.Received()
                                    .UpdateAsync(notification, Arg.Any<CancellationToken>());
    }
}
