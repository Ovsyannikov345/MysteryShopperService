using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using ReviewGuru.DAL.Repositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class OrderRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Order>(context, logger), IOrderRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<IEnumerable<Order>> GetActiveOrdersWithCompanies(CancellationToken cancellationToken = default)
        {
            return await _context.Orders
                .Include(o => o.Company)
                    .ThenInclude(c => c.CompanyReviews)
                .Where(o => !o.IsClosed)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.UserOrders.Where(x => x.UserId == userId)
                .Include(u => u.Order)
                    .ThenInclude(o => o.Company)
                        .ThenInclude(c => c.CompanyReviews)
                .ToListAsync(cancellationToken);
        }
    }
}
