using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    // TODO move all interafaces to their implementations.

    public interface IGenericRepository<TEntity> where TEntity : class
    {
        public Task<int> CountAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default);

        public Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> filter, bool disableTracking = true, CancellationToken cancellationToken = default);

        public Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default);

        public Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

        public Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

        public Task<TEntity?> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

        public Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default);
        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
