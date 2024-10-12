using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        public Task<int> CountAsync(Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default);

        public Task<TEntity?> GetByItemAsync(Expression<Func<TEntity, bool>> filter, CancellationToken cancellationToken = default);

        public Task<IEnumerable<TEntity>> GetAllAsync(int pageNumber, int pageSize, Expression<Func<TEntity, bool>>? filter = null, CancellationToken cancellationToken = default);

        public Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

        public Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

        public Task<TEntity?> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

        public Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellation = default);
    }
}
