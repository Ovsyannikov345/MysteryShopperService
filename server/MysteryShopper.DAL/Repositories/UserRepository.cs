using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories
{
    public class UserRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<User>(context, logger), IUserRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<User?> GetUserWithReviewsAsync(Expression<Func<User, bool>> filter, CancellationToken cancellationToken = default)
        {
            return await _context.Users.AsNoTracking()
                .Include(u => u.Orders)
                    .ThenInclude(o => o.Order)
                .Include(u => u.UserReviews.OrderByDescending(r => r.CreatedAt))
                    .ThenInclude(r => r.Company)
                .FirstOrDefaultAsync(filter, cancellationToken);
        }
    }
}
