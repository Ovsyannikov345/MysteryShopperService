using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Messages;
using MysteryShopper.BLL.Utilities.Querying;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using MysteryShopper.DAL.Utilities.Pagination;
using System.Linq.Expressions;

namespace MysteryShopper.BLL.Services
{
    public class OrderService(
        INotificationService notificationService,
        IOrderRepository orderRepository,
        IUserRepository userRepository,
        IUserOrderRepository userOrderRepository,
        ICategorizationService categorizationService,
        IMapper mapper,
        OrderCreationValidator orderValidator) : IOrderService
    {
        public async Task<PagedResult<Order>> GetOrderListAsync(
            Guid currentUserId,
            OrderSortOptions sortOption,
            OrderQueryFilter filter,
            Pagination pagination,
            CancellationToken cancellationToken = default)
        {
            var sortKeySelector = GetSortKeySelectorFromSortOption(sortOption);

            var isDescending =
                sortOption == OrderSortOptions.DateDescending ||
                sortOption == OrderSortOptions.PriceDescending ||
                sortOption == OrderSortOptions.TimeToCompleteDescending;

            Expression<Func<Order, bool>> predicate = (order) =>
                (string.IsNullOrEmpty(filter.Text) || order.Title.Contains(filter.Text, StringComparison.OrdinalIgnoreCase)
                    || order.Place.Contains(filter.Text, StringComparison.OrdinalIgnoreCase)) &&
                (!filter.MaxPrice.HasValue || order.Price <= filter.MaxPrice) &&
                (!filter.MinPrice.HasValue || order.Price >= filter.MinPrice) &&
                (!filter.MaxTimeToComplete.HasValue || order.TimeToComplete <= filter.MaxTimeToComplete) &&
                (!filter.MinTimeToComplete.HasValue || order.TimeToComplete >= filter.MinTimeToComplete);

            var orders = await orderRepository.GetAvailableOrdersForUserAsync(
                currentUserId, sortKeySelector, predicate, isDescending, pagination.PageNumber, pagination.PageSize, cancellationToken);

            return orders;

            static Expression<Func<Order, object?>> GetSortKeySelectorFromSortOption(OrderSortOptions sortOption)
            {
                Expression<Func<Order, object?>> selector = sortOption switch
                {
                    OrderSortOptions.DateDescending or OrderSortOptions.DateAscending => (o) => o.CreatedAt,
                    OrderSortOptions.PriceDescending or OrderSortOptions.PriceAscending => (o) => o.Price,
                    OrderSortOptions.TimeToCompleteDescending or OrderSortOptions.TimeToCompleteAscending => (o) => o.TimeToComplete,
                    _ => (o) => o.CreatedAt,
                };

                return selector;
            }
        }

        public async Task<OrderModel> CreateOrderAsync(OrderModel orderData, CancellationToken cancellationToken = default)
        {
            var validationResult = orderValidator.Validate(orderData);

            if (!validationResult.IsValid)
            {
                throw new BadRequestException(validationResult.Errors[0].ErrorMessage);
            }

            var createdOrder = await orderRepository.AddAsync(mapper.Map<Order>(orderData), cancellationToken);

            if (createdOrder.Description is null)
            {
                return mapper.Map<OrderModel>(createdOrder);
            }

            await categorizationService.CategorizeOrder(createdOrder, cancellationToken);

            var updatedOrder = await orderRepository.UpdateAsync(createdOrder, cancellationToken);

            return mapper.Map<OrderModel>(updatedOrder);
        }

        public async Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await orderRepository.GetUserOrdersWithCompanyDataAsync(userId, cancellationToken);
        }

        public async Task SendOrderRequestAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
        {
            var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken)
                ?? throw new NotFoundException("Order status is not defined");

            if (userOrder.Status != UserOrderStatus.None)
            {
                throw new BadRequestException("You can't send request to this order");
            }

            userOrder.Status = UserOrderStatus.Requested;

            await userOrderRepository.UpdateAsync(userOrder, cancellationToken);

            await notificationService.CreateNotificationAsync(new NotificationModel
            {
                CompanyId = userOrder.Order.CompanyId,
                Text = NotificationMessages.NewRequest,
            }, cancellationToken);
        }

        public async Task<UserOrder> GetOrderDetailsForUserAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
        {
            var order = await orderRepository.GetByItemAsync(o => o.Id == orderId, cancellationToken)
                ?? throw new NotFoundException("Order is not found");

            var user = await userRepository.GetByItemAsync(u => u.Id == userId, cancellationToken)
                ?? throw new NotFoundException("User is not found");

            var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken);

            if (userOrder is not null)
            {
                return userOrder;
            }

            await userOrderRepository.AddAsync(new UserOrder
            {
                User = user,
                UserId = userId,
                Order = order,
                OrderId = orderId,
                Status = UserOrderStatus.None
            }, cancellationToken);

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

            await notificationService.CreateNotificationAsync(new NotificationModel
            {
                UserId = userOrder.UserId,
                Text = NotificationMessages.RequestAccepted,
            }, cancellationToken);
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

            await notificationService.CreateNotificationAsync(new NotificationModel
            {
                UserId = userOrder.UserId,
                Text = NotificationMessages.RequestRejected,
            }, cancellationToken);
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

            await notificationService.CreateNotificationAsync(new NotificationModel
            {
                UserId = userOrder.UserId,
                Text = NotificationMessages.OrderCompleted,
            }, cancellationToken);
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
