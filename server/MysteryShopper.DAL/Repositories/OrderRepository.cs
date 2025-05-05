using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using MysteryShopper.DAL.Utilities.Pagination;
using Serilog;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories
{
    public class OrderRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Order>(context, logger), IOrderRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<PagedResult<Order>> GetAvailableOrdersForUserAsync<TKey>(
            Guid userId,
            Expression<Func<Order, TKey>> sortKeySelector,
            Expression<Func<Order, bool>> predicate,
            bool isDescending = false,
            int pageNumber = 1,
            int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            var orders = _context.Orders.AsNoTracking()
                .Include(o => o.Company)
                    .ThenInclude(c => c.CompanyReviews)
                .Where(predicate)
                .Where(o => !o.IsClosed && !_context.UserOrders.Any(uo => uo.UserId == userId && uo.OrderId == o.Id));

            Console.WriteLine(orders.ToQueryString());

            var sortedOrders = isDescending
                ? orders.OrderByDescending(sortKeySelector)
                : orders.OrderBy(sortKeySelector);

            var pagedOrders = await sortedOrders.Skip(pageSize * (pageNumber - 1)).Take(pageSize).ToListAsync(cancellationToken);

            var totalCount = await orders.CountAsync(cancellationToken);

            return new PagedResult<Order>
            {
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                PageContent = pagedOrders,
            };
        }

        public async Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.UserOrders.AsNoTracking()
                .Where(x => x.UserId == userId)
                .Include(u => u.Order)
                    .ThenInclude(o => o.Company)
                .Include(u => u.Order)
                    .ThenInclude(o => o.Reports.Where(r => r.UserId == userId))
                        .ThenInclude(r => r.ReportCorrection)
                .Include(u => u.Order)
                    .ThenInclude(o => o.Disputes.Where(d => d.UserId == userId))
                .Include(u => u.Order)
                    .ThenInclude(o => o.UserReviews.Where(r => r.UserId == userId))
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Order>> GetCompanyOrdersAsync(Guid companyId, CancellationToken cancellationToken = default)
        {
            return await _context.Orders.AsNoTracking()
                .Where(o => o.CompanyId == companyId)
                .Include(o => o.Users)
                .Include(o => o.Disputes)
                .Include(o => o.Reports)
                    .ThenInclude(o => o.ReportCorrection)
                .ToListAsync();
        }

        public async Task<Order?> GetFullOrderDetailsAsync(Guid orderId, CancellationToken cancellationToken = default)
        {
            return await _context.Orders.AsNoTracking()
                .Include(o => o.Company)
                    .ThenInclude(c => c.CompanyReviews)
                .Include(o => o.Users)
                    .ThenInclude(xref => xref.User)
                        .ThenInclude(u => u.UserReviews)
                .Include(o => o.Reports)
                    .ThenInclude(r => r.ReportCorrection)
                .Include(o => o.Disputes)
                .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
        }
    }
}
