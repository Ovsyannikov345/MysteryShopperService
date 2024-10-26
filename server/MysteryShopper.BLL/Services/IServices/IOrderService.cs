using MysteryShopper.BLL.Dto;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetOrderListAsync(CancellationToken cancellationToken = default);

        Task<OrderModel> CreateOrderAsync(OrderModel orderData, CancellationToken cancellationToken = default);

        Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default);

        Task SendOrderRequestAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);

        Task<UserOrder> GetOrderDetailsForUserAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);

        Task<OrderModel> GetOrderDetailsForCompanyAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default);

        Task AcceptRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default);

        Task RejectRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default);

        Task AcceptOrderAsync(Guid companyId, Guid userId, Guid orderId, CancellationToken cancellationToken = default);

        Task FinishOrderAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default);
    }
}