using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class OrderRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Order>(context, logger), IOrderRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<IEnumerable<Order>> GetActiveOrdersWithCompanies(CancellationToken cancellationToken = default)
        {
            return await _context.Orders.AsNoTracking()
                .Include(o => o.Company)
                    .ThenInclude(c => c.CompanyReviews)
                .Where(o => !o.IsClosed)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.UserOrders.AsNoTracking()
                .Where(x => x.UserId == userId)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<UserOrder>> GetUserOrdersWithCompanyDataAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.UserOrders.AsNoTracking()
                .Where(x => x.UserId == userId)
                .Include(u => u.Order)
                    .ThenInclude(o => o.Company)
                        .ThenInclude(c => c.CompanyReviews)
                .ToListAsync(cancellationToken);
        }

        public async Task<Order?> GetFullOrderDetailsAsync(Guid orderId, CancellationToken cancellationToken = default)
        {
            return await _context.Orders.AsNoTracking()
                .Include(o => o.Company)
                    .ThenInclude(c => c.CompanyReviews)
                .Include(o => o.Users)
                .Include(o => o.Reports)
                    .ThenInclude(r => r.ReportCorrection)
                .Include(o => o.Disputes)
                .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
        }
    }
}
