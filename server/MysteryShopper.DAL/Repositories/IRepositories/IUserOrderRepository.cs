using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IUserOrderRepository : IGenericRepository<UserOrder>
    {
        Task<UserOrder?> GetUserOrder(Guid userId, Guid orderId, CancellationToken cancellationToken = default);
    }
}
