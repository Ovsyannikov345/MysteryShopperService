using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface INotificationRepository : IGenericRepository<Notification>;

public class NotificationRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Notification>(context, logger), INotificationRepository;
