using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<IEnumerable<Order>> GetActiveOrdersWithCompanies(CancellationToken cancellationToken = default);

        Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default)

        Task<IEnumerable<UserOrder>> GetUserOrdersWithCompanyDataAsync(Guid userId, CancellationToken cancellationToken = default);

        Task<Order?> GetFullOrderDetailsAsync(Guid orderId, CancellationToken cancellationToken = default);
    }
}