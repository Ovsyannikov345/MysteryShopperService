using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class CategoryRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Category>(context, logger), ICategoryRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<IEnumerable<Category>> GetCategoriesWithTags(CancellationToken cancellationToken = default)
        {
            return await _context.Categories.AsNoTracking()
                .Include(c => c.Tags)
                .ToListAsync(cancellationToken);
        }
    }
}
