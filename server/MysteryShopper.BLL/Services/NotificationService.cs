﻿using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.BLL.Services
{
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
            var notifications = await notificationRepository.GetAllAsync(n => n.CompanyId == companyId, cancellationToken);

            return mapper.Map<IEnumerable<Notification>, IEnumerable<NotificationModel>>(notifications);
        }

        public async Task<IEnumerable<NotificationModel>> GetUserNotificationsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var notifications = await notificationRepository.GetAllAsync(n => n.UserId == userId, cancellationToken);

            return mapper.Map<IEnumerable<Notification>, IEnumerable<NotificationModel>>(notifications);
        }

        public async Task ReadCompanyNotificationAsync(Guid notificationId, Guid companyId, CancellationToken cancellationToken = default)
        {
            var notification = await notificationRepository.GetByItemAsync(n => n.Id == notificationId, cancellationToken)
                ?? throw new NotFoundException("Notification is not found");

            if (notification.CompanyId != companyId)
            {
                throw new ForbiddenException("You can't access this notification");
            }

            notification.IsRead = true;
            await notificationRepository.UpdateAsync(notification, cancellationToken);
        }

        public async Task ReadUserNotificationAsync(Guid notificationId, Guid userId, CancellationToken cancellationToken = default)
        {
            var notification = await notificationRepository.GetByItemAsync(n => n.Id == notificationId, cancellationToken)
                ?? throw new NotFoundException("Notification is not found");

            if (notification.UserId != userId)
            {
                throw new ForbiddenException("You can't access this notification");
            }

            notification.IsRead = true;
            await notificationRepository.UpdateAsync(notification, cancellationToken);
        }
    }
}
