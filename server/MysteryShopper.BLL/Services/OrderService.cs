using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.Services
{
    public class OrderService(
        IOrderRepository orderRepository,
        IUserOrderRepository userOrderRepository,
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
            var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken);

            if (userOrder is null)
            {
                throw new NotFoundException("Order status is not defined");
            }

            if (userOrder.Status != UserOrderStatus.None)
            {
                throw new BadRequestException("You can't send request to this order");
            }

            userOrder.Status = UserOrderStatus.Requested;

            await userOrderRepository.UpdateAsync(userOrder, cancellationToken);
        }

        public async Task<UserOrder> GetOrderDetailsForUserAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
        {
            if (!await orderRepository.ExistsAsync(o => o.Id == orderId, cancellationToken))
            {
                throw new NotFoundException("Order is not found");
            }

            var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken);

            if (userOrder is not null)
            {
                return userOrder;
            }

            await userOrderRepository.AddAsync(new UserOrder { UserId = userId, OrderId = orderId, Status = UserOrderStatus.None }, cancellationToken);

            return (await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken))!;
        }

        public async Task<OrderModel> GetOrderDetailsForCompanyAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default)
        {
            var order = await orderRepository.GetFullOrderDetailsAsync(orderId, cancellationToken)
                ?? throw new NotFoundException("Order is not found");

            if (order.CompanyId != companyId)
            {
                throw new ForbiddenException("You are not the owner of the order");
            }

            return mapper.Map<OrderModel>(order);
        }

        public async Task AcceptRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default)
        {
            var userOrder = await userOrderRepository.GetUserOrderAsync(id, cancellationToken)
                ?? throw new NotFoundException("Order status for user is not specified");

            if (userOrder.Order.Company.Id != companyId)
            {
                throw new ForbiddenException("You can't accept this request");
            }

            if (userOrder.Status != UserOrderStatus.Requested)
            {
                throw new BadRequestException("You can't accept this request");
            }

            userOrder.Status = UserOrderStatus.InProgress;

            await userOrderRepository.UpdateAsync(userOrder, cancellationToken);
        }

        public async Task RejectRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default)
        {
            var userOrder = await userOrderRepository.GetUserOrderAsync(id, cancellationToken)
                ?? throw new NotFoundException("Order status for user is not specified");

            if (userOrder.Order.Company.Id != companyId)
            {
                throw new ForbiddenException("You can't reject this request");
            }

            if (userOrder.Status != UserOrderStatus.Requested)
            {
                throw new BadRequestException("You can't reject this request");
            }

            userOrder.Status = UserOrderStatus.Rejected;
            await userOrderRepository.UpdateAsync(userOrder, cancellationToken);
        }

        public async Task AcceptOrderAsync(Guid companyId, Guid userId, Guid orderId, CancellationToken cancellationToken = default)
        {
            var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken)
                ?? throw new NotFoundException("Order status for user is not specified");

            if (userOrder.Order.Company.Id != companyId)
            {
                throw new ForbiddenException("You can't finish this order");
            }

            if (userOrder.Status != UserOrderStatus.InProgress)
            {
                throw new BadRequestException("You can't finish this order");
            }

            userOrder.Status = UserOrderStatus.Completed;
            await userOrderRepository.UpdateAsync(userOrder, cancellationToken);
        }

        public async Task FinishOrderAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default)
        {
            var order = await orderRepository.GetByItemAsync(o => o.Id == orderId, cancellationToken)
                ?? throw new NotFoundException("Order is not found");

            if (order.CompanyId != companyId)
            {
                throw new ForbiddenException("You can't finish this order");
            }

            var userOrders = await userOrderRepository.GetAllAsync(u => u.OrderId == orderId, cancellationToken);

            if (userOrders.Any(u => u.Status == UserOrderStatus.InProgress))
            {
                throw new BadRequestException("Some users are currently working on this order");
            }

            order.IsClosed = true;
            await orderRepository.UpdateAsync(order, cancellationToken);
        }
    }
}
