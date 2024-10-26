using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class UserOrderRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<UserOrder>(context, logger), IUserOrderRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<UserOrder?> GetUserOrderAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
        {
            return await _context.UserOrders.AsNoTracking()
                .Include(o => o.Order)
                    .ThenInclude(o => o.Company)
                        .ThenInclude(c => c.CompanyReviews)
                .FirstOrDefaultAsync(o => o.UserId == userId && o.OrderId == orderId, cancellationToken);
        }

        public async Task<UserOrder?> GetUserOrderAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _context.UserOrders.AsNoTracking()
                .Include(o => o.Order)
                    .ThenInclude(o => o.Company)
                        .ThenInclude(c => c.CompanyReviews)
                .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }
    }
}
