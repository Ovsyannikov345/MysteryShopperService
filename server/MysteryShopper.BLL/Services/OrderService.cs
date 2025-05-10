using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Messages;
using MysteryShopper.BLL.Utilities.Querying;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopper.DAL.Utilities.Pagination;
using System.Linq.Expressions;

namespace MysteryShopper.BLL.Services;

public interface IOrderService
{
    Task AcceptOrderAsync(Guid companyId, Guid userId, Guid orderId, CancellationToken cancellationToken = default);

    Task AcceptRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default);

    Task<OrderModel> CreateOrderAsync(OrderModel orderData, CancellationToken cancellationToken = default);

    Task ExpireOrderAsync(Guid companyId, Guid userId, Guid orderId, CancellationToken cancellationToken = default);

    Task FinishOrderAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default);

    Task<IEnumerable<OrderModel>> GetCompanyOrdersAsync(Guid companyId, CancellationToken cancellationToken = default);

    Task<OrderModel> GetOrderDetailsForCompanyAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default);

    Task<UserOrder> GetOrderDetailsForUserAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);

    Task<PagedResult<Order>> GetOrderListAsync(Guid currentUserId, OrderSortOptions sortOption, OrderQueryFilter filter, Pagination pagination, CancellationToken cancellationToken = default);

    Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default);

    Task RejectRequestAsync(Guid companyId, Guid id, CancellationToken cancellationToken = default);

    Task SendOrderRequestAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default);
}

public class OrderService(
        INotificationService notificationService,
        IOrderRepository orderRepository,
        IUserRepository userRepository,
        IUserOrderRepository userOrderRepository,
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
            (string.IsNullOrEmpty(filter.Text) || EF.Functions.ILike(order.Title, $"%{filter.Text}%")
                || EF.Functions.ILike(order.Place, $"%{filter.Text}%")) &&
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

        var updatedOrder = await orderRepository.UpdateAsync(createdOrder, cancellationToken);

        return mapper.Map<OrderModel>(updatedOrder);
    }

    public async Task<IEnumerable<UserOrder>> GetUserOrdersAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await orderRepository.GetUserOrdersAsync(userId, cancellationToken);
    }

    public async Task<IEnumerable<OrderModel>> GetCompanyOrdersAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        var orders = await orderRepository.GetCompanyOrdersAsync(companyId, cancellationToken);

        return mapper.Map<IEnumerable<Order>, IEnumerable<OrderModel>>(orders);
    }

    public async Task SendOrderRequestAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
    {
        var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken)
            ?? throw new NotFoundException("Order status is not defined");

        if (userOrder.Status != UserOrderStatus.None)
        {
            throw new BadRequestException("You can't send request to this order");
        }

        var userOrderToUpdate = await userOrderRepository.GetAsync(u => u.Id == userOrder.Id, disableTracking: false, cancellationToken: cancellationToken)!;

        userOrderToUpdate!.Status = UserOrderStatus.Requested;
        userOrderToUpdate.RequestedAt = DateTime.UtcNow;

        await userOrderRepository.SaveChangesAsync(cancellationToken);

        await notificationService.CreateNotificationAsync(new NotificationModel
        {
            CompanyId = userOrder.Order.CompanyId,
            Text = NotificationMessages.NewRequest,
        }, cancellationToken);
    }

    public async Task<UserOrder> GetOrderDetailsForUserAsync(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
    {
        var order = await orderRepository.GetAsync(o => o.Id == orderId, disableTracking: false, cancellationToken)
            ?? throw new NotFoundException("Order is not found");

        var user = await userRepository.GetAsync(u => u.Id == userId, disableTracking: false, cancellationToken)
            ?? throw new NotFoundException("User is not found");

        var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken);

        if (userOrder is not null)
        {
            userOrder.Order.Reports = [.. userOrder.Order.Reports.Where(r => r.UserId == userId).OrderBy(r => r.CreatedAt)];

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

        userOrder = (await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken))!;

        return userOrder;
    }

    public async Task<OrderModel> GetOrderDetailsForCompanyAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default)
    {
        var order = await orderRepository.GetFullOrderDetailsAsync(orderId, cancellationToken)
            ?? throw new NotFoundException("Order is not found");

        if (order.CompanyId != companyId)
        {
            throw new ForbiddenException("You are not the owner of the order");
        }

        var orderModel = mapper.Map<OrderModel>(order);

        orderModel.Reports = [.. orderModel.Reports.OrderBy(r => r.CreatedAt)];

        return orderModel;
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

        var userOrderToUpdate = await userOrderRepository.GetAsync(u => u.Id == userOrder.Id, disableTracking: false, cancellationToken: cancellationToken);

        userOrderToUpdate!.Status = UserOrderStatus.InProgress;
        userOrderToUpdate.AcceptedAt = DateTime.UtcNow;

        await userOrderRepository.SaveChangesAsync(cancellationToken);

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

        var userOrderToUpdate = await userOrderRepository.GetAsync(u => u.Id == userOrder.Id, disableTracking: false, cancellationToken: cancellationToken);

        userOrderToUpdate!.Status = UserOrderStatus.Rejected;
        await userOrderRepository.SaveChangesAsync(cancellationToken);

        await notificationService.CreateNotificationAsync(new NotificationModel
        {
            UserId = userOrder.UserId,
            Text = NotificationMessages.RequestRejected,
        }, cancellationToken);
    }

    public async Task ExpireOrderAsync(Guid companyId, Guid userId, Guid orderId, CancellationToken cancellationToken = default)
    {
        var userOrder = await userOrderRepository.GetUserOrderAsync(userId, orderId, cancellationToken)
            ?? throw new NotFoundException("Order status for user is not specified");

        if (userOrder.Order.Company.Id != companyId ||
            userOrder.Status != UserOrderStatus.InProgress)
        {
            throw new ForbiddenException("You can't expire this order");
        }

        var userOrderToUpdate = await userOrderRepository.GetAsync(u => u.Id == userOrder.Id, disableTracking: false, cancellationToken: cancellationToken);

        userOrderToUpdate!.Status = UserOrderStatus.Expired;
        await userOrderRepository.SaveChangesAsync(cancellationToken);

        await notificationService.CreateNotificationAsync(new NotificationModel
        {
            UserId = userOrder.UserId,
            Text = NotificationMessages.OrderExpired,
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

        var userOrderToUpdate = await userOrderRepository.GetAsync(u => u.Id == userOrder.Id, disableTracking: false, cancellationToken: cancellationToken);

        userOrderToUpdate!.Status = UserOrderStatus.Completed;
        await userOrderRepository.SaveChangesAsync(cancellationToken);

        await notificationService.CreateNotificationAsync(new NotificationModel
        {
            UserId = userOrder.UserId,
            Text = NotificationMessages.OrderCompleted,
        }, cancellationToken);
    }

    public async Task FinishOrderAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default)
    {
        var order = await orderRepository.GetAsync(o => o.Id == orderId, disableTracking: false, cancellationToken)
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

        foreach (var userOrder in userOrders.Where(u => u.Status == UserOrderStatus.Requested))
        {
            userOrder.Status = UserOrderStatus.Rejected;
            await userOrderRepository.UpdateAsync(userOrder, cancellationToken);
        }
    }
}
