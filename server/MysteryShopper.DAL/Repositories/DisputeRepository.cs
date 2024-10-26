using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories
{
    public class DisputeRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Dispute>(context, logger), IDisputeRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<IEnumerable<Dispute>> GetDisputesAsync(Expression<Func<Dispute, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await _context.Disputes.AsNoTracking()
                .Where(predicate)
                .Include(d => d.Order)
                    .ThenInclude(o => o.Company)
                .Include(d => d.User)
                .ToListAsync(cancellationToken);
        }

        public async Task<Dispute?> GetDisputeWithOrderAsync(Expression<Func<Dispute, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await _context.Disputes.AsNoTracking()
                .Include(d => d.Order)
                    .ThenInclude(o => o.Company)
                .Include(d => d.User)
                .FirstOrDefaultAsync(predicate, cancellationToken);
        }
    }
}
