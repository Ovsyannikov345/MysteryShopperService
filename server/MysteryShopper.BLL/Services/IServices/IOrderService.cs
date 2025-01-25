using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Querying;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Utilities.Pagination;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IOrderService
    {
        Task<PagedResult<Order>> GetOrderListAsync(
            Guid currentUserId,
            OrderSortOptions sortOption,
            OrderQueryFilter filter,
            Pagination pagination,
            CancellationToken cancellationToken = default);

        Task<OrderModel> CreateOrderAsync(OrderModel orderData, CancellationToken cancellationToken = default);

        Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default);

        Task<IEnumerable<OrderModel>> GetCompanyOrdersAsync(Guid companyId, CancellationToken cancellationToken = default);

        Task SendOrderRequestAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);

        Task<UserOrder> GetOrderDetailsForUserAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);

        Task<OrderModel> GetOrderDetailsForCompanyAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default);

        Task AcceptRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default);

        Task RejectRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default);

        Task AcceptOrderAsync(Guid companyId, Guid userId, Guid orderId, CancellationToken cancellationToken = default);

        Task FinishOrderAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default);
    }
}