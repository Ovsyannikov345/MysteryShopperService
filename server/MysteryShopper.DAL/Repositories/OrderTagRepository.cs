using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class OrderTagRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<OrderTag>(context, logger), IOrderTagRepository;
}
