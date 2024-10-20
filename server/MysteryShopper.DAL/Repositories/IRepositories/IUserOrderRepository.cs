using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IUserOrderRepository : IGenericRepository<UserOrder>
    {
        Task<UserOrder?> GetUserOrderAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);

        Task<UserOrder?> GetUserOrderAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
