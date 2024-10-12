using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<IEnumerable<Order>> GetActiveOrdersWithCompanies(CancellationToken cancellationToken = default);

        public Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default);

        public Task<bool> IsOrderTrackedAsync(Guid orderId, Guid userId, CancellationToken cancellationToken = default);

        public Task TrackOrderAsync(Guid orderId, Guid userId, CancellationToken cancellationToken = default);
    }
}