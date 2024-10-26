using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using MysteryShopper.DAL.Repositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class RefreshTokenRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<RefreshToken>(context, logger), IRefreshTokenRepository
    {
    }
}
