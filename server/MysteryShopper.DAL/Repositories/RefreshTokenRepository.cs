using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>;

public class RefreshTokenRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<RefreshToken>(context, logger), IRefreshTokenRepository
{
}
