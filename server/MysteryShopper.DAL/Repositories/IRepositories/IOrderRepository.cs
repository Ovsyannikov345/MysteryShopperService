using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Utilities.Pagination;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<PagedResult<Order>> GetAvailableOrdersForUserAsync<TKey>(
            Guid userId,
            Expression<Func<Order, TKey>> sortKeySelector,
            Expression<Func<Order, bool>> predicate,
            bool isDescending = false,
            int pageNumber = 1,
            int pageSize = 10,
            CancellationToken cancellationToken = default);

        Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default);

        Task<Order?> GetFullOrderDetailsAsync(Guid orderId, CancellationToken cancellationToken = default);
    }
}