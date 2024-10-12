using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using ReviewGuru.DAL.Repositories;
using Serilog;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories
{
    public class CompanyRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Company>(context, logger), ICompanyRepository
    {
        public async Task<Company?> GetCompanyWithReviewsAsync(Expression<Func<Company, bool>> filter, CancellationToken cancellationToken = default)
        {
            return await context.Companies
                .Include(c => c.ContactPerson)
                .Include(c => c.Orders)
                .Include(c => c.CompanyReviews)
                    .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(filter, cancellationToken);
        }
    }
}
