using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.Services
{
    public class OrderService(
        IOrderRepository orderRepository,
        IMapper mapper,
        OrderCreationValidator orderValidator) : IOrderService
    {
        public async Task<IEnumerable<Order>> GetOrderListAsync(CancellationToken cancellationToken = default)
        {
            return await orderRepository.GetActiveOrdersWithCompanies(cancellationToken);
        }

        public async Task<OrderModel> CreateOrderAsync(OrderModel orderData, CancellationToken cancellationToken = default)
        {
            var validationResult = orderValidator.Validate(orderData);

            if (!validationResult.IsValid)
            {
                throw new BadRequestException(validationResult.Errors[0].ErrorMessage);
            }

            var createdOrder = await orderRepository.AddAsync(mapper.Map<Order>(orderData), cancellationToken);

            return mapper.Map<OrderModel>(createdOrder);
        }

        public async Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await orderRepository.GetUserOrdersAsync(userId, cancellationToken);
        }

        public async Task SendOrderRequestAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
        {
            if (await orderRepository.IsOrderTrackedAsync(orderId, userId, cancellationToken))
            {
                throw new BadRequestException("Order is already being tracked");
            }

            await orderRepository.TrackOrderAsync(orderId, userId, cancellationToken);
        }
    }
}
