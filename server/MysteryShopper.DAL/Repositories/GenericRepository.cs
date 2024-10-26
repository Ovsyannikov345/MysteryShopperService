using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;
using System.Linq.Expressions;

namespace ReviewGuru.DAL.Repositories;

public class GenericRepository<TEntity>(MysteryShopperDbContext context, ILogger logger) : IGenericRepository<TEntity> where TEntity : class, new()
{
    private readonly MysteryShopperDbContext _context = context;

    protected readonly DbSet<TEntity> _dbSet = context.Set<TEntity>();

    private readonly ILogger _logger = logger;

    public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default)
    {
        _context.Set<TEntity>();

        int count = filter == null ? await _dbSet.CountAsync(cancellationToken) : await _dbSet.CountAsync(filter, cancellationToken);

        _logger.Information("{0} CountAsync called. Count: {1}", typeof(TEntity), count);

        return count;
    }

    public virtual async Task<TEntity?> GetByItemAsync(Expression<Func<TEntity, bool>> filter, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Set<TEntity>().AsNoTracking().FirstOrDefaultAsync(filter, cancellationToken);

        _logger.Information("{0} GetByItemAsync called. Entity: {1}", typeof(TEntity), entity);

        return entity;
    }

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default)
    {
        var entities = filter == null ? _dbSet : _dbSet.Where(filter);

        var result = await entities.AsNoTracking().ToListAsync(cancellationToken);

        _logger.Information("{0} GetAllAsync called. Entities returned: {1}", typeof(TEntity), result.Count);

        return result;
    }

    public virtual async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.Information("{0} AddAsync called. Entity: {1}", typeof(TEntity), entity);

        return entity;
    }

    public virtual async Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.Information("{0} UpdateAsync called. Entity: {1}", typeof(TEntity), entity);

        return entity;
    }

    public virtual async Task<TEntity?> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _dbSet.FindAsync([id], cancellationToken: cancellationToken);

        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }

        _logger.Information("{0} DeleteAsync called. Entity: {1}", typeof(TEntity), entity);

        return entity;
    }

    public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default)
    {
        return await _dbSet.AnyAsync(predicate, cancellation);
    }
}
