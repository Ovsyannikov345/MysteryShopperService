using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(NotificationModel notificationData, CancellationToken cancellationToken = default);

        Task ReadUserNotificationAsync(Guid notificationId, Guid userId, CancellationToken cancellationToken = default);

        Task ReadCompanyNotificationAsync(Guid notificationId, Guid companyId, CancellationToken cancellationToken = default);

        Task<IEnumerable<NotificationModel>> GetUserNotificationsAsync(Guid userId, CancellationToken cancellationToken = default);

        Task<IEnumerable<NotificationModel>> GetCompanyNotificationsAsync(Guid companyId, CancellationToken cancellationToken = default);
    }
}
