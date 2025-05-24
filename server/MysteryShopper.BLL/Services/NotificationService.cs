using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using Serilog;

namespace MysteryShopper.BLL.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(NotificationModel notificationData, CancellationToken cancellationToken = default);

    Task<IEnumerable<NotificationModel>> GetCompanyNotificationsAsync(Guid companyId, CancellationToken cancellationToken = default);

    Task<IEnumerable<NotificationModel>> GetUserNotificationsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task ReadCompanyNotificationAsync(Guid notificationId, Guid companyId, CancellationToken cancellationToken = default);

    Task ReadUserNotificationAsync(Guid notificationId, Guid userId, CancellationToken cancellationToken = default);
}

public class NotificationService(INotificationRepository notificationRepository, IMapper mapper, ILogger logger) : INotificationService
{
    public async Task CreateNotificationAsync(NotificationModel notificationData, CancellationToken cancellationToken = default)
    {
        try
        {
            await notificationRepository.AddAsync(mapper.Map<Notification>(notificationData), cancellationToken);
        }
        catch (Exception ex)
        {
            logger.Error(ex, ex.Message);
        }
    }

    public async Task<IEnumerable<NotificationModel>> GetCompanyNotificationsAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        var notifications = await notificationRepository.GetCompanyNotifications(companyId, cancellationToken: cancellationToken);

        return mapper.Map<IEnumerable<Notification>, IEnumerable<NotificationModel>>(notifications);
    }

    public async Task<IEnumerable<NotificationModel>> GetUserNotificationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var notifications = await notificationRepository.GetUserNotifications(userId, cancellationToken: cancellationToken);

        return mapper.Map<IEnumerable<Notification>, IEnumerable<NotificationModel>>(notifications);
    }

    public async Task ReadCompanyNotificationAsync(Guid notificationId, Guid companyId, CancellationToken cancellationToken = default)
    {
        var notification = await notificationRepository.GetAsync(n => n.Id == notificationId, disableTracking: true, cancellationToken)
            ?? throw new NotFoundException("Уведомление не найдено");

        if (notification.CompanyId != companyId)
        {
            throw new ForbiddenException("Вы не можете прочитать чужое уведомление");
        }

        notification.IsRead = true;
        await notificationRepository.UpdateAsync(notification, cancellationToken);
    }

    public async Task ReadUserNotificationAsync(Guid notificationId, Guid userId, CancellationToken cancellationToken = default)
    {
        var notification = await notificationRepository.GetAsync(n => n.Id == notificationId, disableTracking: true, cancellationToken)
            ?? throw new NotFoundException("Уведомление не найдено");

        if (notification.UserId != userId)
        {
            throw new ForbiddenException("Вы не можете прочитать чужое уведомление");
        }

        notification.IsRead = true;
        await notificationRepository.UpdateAsync(notification, cancellationToken);
    }
}
