using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface ISupportRequestRepository : IGenericRepository<SupportRequest>;

public class SupportRequestRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<SupportRequest>(context, logger), ISupportRequestRepository;
