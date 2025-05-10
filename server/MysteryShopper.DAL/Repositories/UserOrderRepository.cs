using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface IUserOrderRepository : IGenericRepository<UserOrder>
{
    Task<UserOrder?> GetUserOrderAsync(Guid id, CancellationToken cancellationToken = default);

    Task<UserOrder?> GetUserOrderAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);
}

public class UserOrderRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<UserOrder>(context, logger), IUserOrderRepository
{
    private readonly MysteryShopperDbContext _context = context;

    public async Task<UserOrder?> GetUserOrderAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
    {
        return await _context.UserOrders.AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.Order)
                .ThenInclude(o => o.Company)
                    .ThenInclude(c => c.CompanyReviews)
            .Include(xref => xref.Order)
                .ThenInclude(o => o.Reports.Where(r => r.UserId == userId))
                    .ThenInclude(r => r.ReportCorrection)
            .Include(xref => xref.Order)
                .ThenInclude(o => o.CompanyReviews)
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
