﻿using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using System.Runtime.InteropServices;

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
            var userOrder = await userOrderRepository.GetUserOrder(userId, orderId, cancellationToken);

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

            var userOrder = await userOrderRepository.GetUserOrder(userId, orderId, cancellationToken);

            if (userOrder is not null)
            {
                return userOrder;
            }

            await userOrderRepository.AddAsync(new UserOrder { UserId = userId, OrderId = orderId, Status = UserOrderStatus.None }, cancellationToken);

            return (await userOrderRepository.GetUserOrder(userId, orderId, cancellationToken))!;
        }
    }
}
