using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface INotificationRepository : IGenericRepository<Notification>
{
    Task<List<Notification>> GetCompanyNotifications(Guid companyId, int count = 30, CancellationToken cancellationToken = default);

    Task<List<Notification>> GetUserNotifications(Guid userId, int count = 30, CancellationToken cancellationToken = default);
}

public class NotificationRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Notification>(context, logger), INotificationRepository
{
    public async Task<List<Notification>> GetUserNotifications(Guid userId, int count = 30, CancellationToken cancellationToken = default)
    {
        return await GetNotifications(userId, isUser: true, count, cancellationToken);
    }

    public async Task<List<Notification>> GetCompanyNotifications(Guid companyId, int count = 30, CancellationToken cancellationToken = default)
    {
        return await GetNotifications(companyId, isUser: false, count, cancellationToken);
    }

    private async Task<List<Notification>> GetNotifications(Guid ownerId, bool isUser, int count, CancellationToken cancellationToken = default)
    {
        var entities = _dbSet.AsNoTracking();

        entities = isUser
            ? entities.Where(n => n.UserId == ownerId)
            : entities.Where(n => n.CompanyId == ownerId);

        return await entities
            .OrderBy(n => n.IsRead)
            .ThenByDescending(n => n.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }
}
