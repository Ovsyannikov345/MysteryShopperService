﻿using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories;

public interface IGenericRepository<TEntity> where TEntity : EntityBase
{
    Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    Task<int> CountAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default);

    Task<TEntity?> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default);

    Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default);

    Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> filter, bool disableTracking = true, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
}

public class GenericRepository<TEntity>(MysteryShopperDbContext context, ILogger logger) : IGenericRepository<TEntity> where TEntity : EntityBase
{
    private readonly MysteryShopperDbContext _context = context;

    protected readonly DbSet<TEntity> _dbSet = context.Set<TEntity>();

    private readonly ILogger _logger = logger;

    public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default)
    {
        _context.Set<TEntity>().AsNoTracking();

        int count = filter == null ? await _dbSet.CountAsync(cancellationToken) : await _dbSet.CountAsync(filter, cancellationToken);

        _logger.Information("{0} CountAsync called. Count: {1}", typeof(TEntity), count);

        return count;
    }

    public virtual async Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> filter, bool disableTracking = true, CancellationToken cancellationToken = default)
    {
        var query = _context.Set<TEntity>().AsQueryable();

        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        var entity = await query.FirstOrDefaultAsync(filter, cancellationToken);

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
        return await _dbSet.AsNoTracking().AnyAsync(predicate, cancellation);
    }

    public virtual async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
