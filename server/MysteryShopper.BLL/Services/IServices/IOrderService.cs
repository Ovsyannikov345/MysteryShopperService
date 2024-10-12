using MysteryShopper.BLL.Dto;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetOrderListAsync(CancellationToken cancellationToken = default);

        public Task<OrderModel> CreateOrderAsync(OrderModel orderData, CancellationToken cancellationToken = default);

        public Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default);

        public Task SendOrderRequestAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);
    }
}