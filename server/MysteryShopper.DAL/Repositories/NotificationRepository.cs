using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class NotificationRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Notification>(context, logger), INotificationRepository;
}
