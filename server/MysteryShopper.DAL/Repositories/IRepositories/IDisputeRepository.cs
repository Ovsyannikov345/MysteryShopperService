using MysteryShopper.DAL.Entities.Models;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IDisputeRepository : IGenericRepository<Dispute>
    {
        Task<IEnumerable<Dispute>> GetDisputesAsync(Expression<Func<Dispute, bool>> predicate, CancellationToken cancellationToken = default);

        Task<Dispute?> GetDisputeWithOrderAsync(Expression<Func<Dispute, bool>> predicate, CancellationToken cancellationToken = default);
    }
}
