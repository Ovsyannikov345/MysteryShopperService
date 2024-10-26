using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class SupportRequestRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<SupportRequest>(context, logger), ISupportRequestRepository;
}
