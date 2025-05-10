using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories;

public interface ICompanyRepository : IGenericRepository<Company>
{
    Task<Company?> GetCompanyWithReviewsAsync(Expression<Func<Company, bool>> filter, CancellationToken cancellationToken = default);
}

public class CompanyRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Company>(context, logger), ICompanyRepository
{
    private readonly MysteryShopperDbContext _context = context;

    public async Task<Company?> GetCompanyWithReviewsAsync(Expression<Func<Company, bool>> filter, CancellationToken cancellationToken = default)
    {
        return await _context.Companies.AsNoTracking()
            .Include(c => c.ContactPerson)
            .Include(c => c.Orders)
            .Include(c => c.CompanyReviews.OrderByDescending(r => r.CreatedAt))
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(filter, cancellationToken);
    }
}
