using AutoFixture.Xunit2;
using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using Shouldly;
using System.Linq.Expressions;

namespace MysteryShopperService.BLL.Tests;

public class OrderServiceTests
{
    [Theory, AutoDomainData]
    public async Task CreateOrderAsync_ValidOrderWithDescription_ReturnsMappedModel(
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IMapper mapper,
        Order order,
        OrderService orderService)
    {
        // Arrange
        orderRepository.AddAsync(Arg.Any<Order>(), Arg.Any<CancellationToken>())
                       .Returns(order);

        // Act
        var result = await orderService.CreateOrderAsync(mapper.Map<OrderModel>(order));

        // Assert
        result.Id.ShouldBe(order.Id);
    }

    [Theory, AutoDomainData]
    public async Task GetUserOrdersAsync_ValidFlow_ReturnsList(
        [Frozen] IOrderRepository orderRepository,
        OrderService orderService,
        IEnumerable<UserOrder> userOrders)
    {
        orderRepository.GetUserOrdersAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(userOrders);

        var result = await orderService.GetUserOrdersAsync(Guid.NewGuid());

        result.Count().ShouldBe(userOrders.Count());
    }

    [Theory, AutoDomainData]
    public async Task GetComapnyOrdersAsync_ValidFlow_ReturnsList(
        [Frozen] IOrderRepository orderRepository,
        OrderService orderService,
        IEnumerable<Order> orders)
    {
        orderRepository.GetCompanyOrdersAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(orders);

        var result = await orderService.GetCompanyOrdersAsync(Guid.NewGuid());

        result.Count().ShouldBe(orders.Count());
    }

    [Theory, AutoDomainData]
    public async Task SendOrderRequestAsync_UserOrderNotFound_ThrowsNotFound(
        [Frozen] IUserOrderRepository userOrderRepository,
        OrderService orderService)
    {
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((UserOrder?)null);

        await orderService.SendOrderRequestAsync(Guid.NewGuid(), Guid.NewGuid()).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task SendOrderRequestAsync_StatusIsNotNone_ThrowsBadRequest(
        [Frozen] IUserOrderRepository userOrderRepository,
        OrderService orderService,
        UserOrder userOrder)
    {
        userOrder.Status = UserOrderStatus.Rejected;

        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(userOrder);

        await orderService.SendOrderRequestAsync(Guid.NewGuid(), Guid.NewGuid()).ShouldThrowAsync<BadRequestException>();
    }

    [Theory, AutoDomainData]
    public async Task SendOrderRequestAsync_ValidFlow_NotThrows(
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] INotificationService notificationService,
        OrderService orderService,
        UserOrder userOrder)
    {
        userOrder.Status = UserOrderStatus.None;

        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(userOrder);
        userOrderRepository.GetAsync(Arg.Any<Expression<Func<UserOrder, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(userOrder);
        userOrderRepository.SaveChangesAsync(Arg.Any<CancellationToken>())
            .Returns(Task.CompletedTask);
        notificationService.CreateNotificationAsync(Arg.Any<NotificationModel>(), Arg.Any<CancellationToken>())
            .Returns(Task.CompletedTask);

        await orderService.SendOrderRequestAsync(Guid.NewGuid(), Guid.NewGuid()).ShouldNotThrowAsync();
    }

    [Theory, AutoDomainData]
    public async Task GetOrderDetailsForUserAsync_OrderNotFound_ThrowsNotFound(
        [Frozen] IOrderRepository orderRepository,
        OrderService orderService)
    {
        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns((Order?)null);

        await orderService.GetOrderDetailsForUserAsync(Guid.NewGuid(), Guid.NewGuid()).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task GetOrderDetailsForUserAsync_UserNotFound_ThrowsNotFound(
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IUserRepository userRepository,
        OrderService orderService,
        Order order)
    {
        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(order);
        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns((User?)null);

        await orderService.GetOrderDetailsForUserAsync(Guid.NewGuid(), Guid.NewGuid()).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task GetOrderDetailsForUserAsync_UserOrderIsNotNull_ReturnsDetailsWithReports(
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IUserRepository userRepository,
        OrderService orderService,
        [Frozen] Order order,
        [Frozen] User user,
        UserOrder userOrder)
    {
        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(order);
        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(user);
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(userOrder);

        var result = await orderService.GetOrderDetailsForUserAsync(Guid.NewGuid(), Guid.NewGuid());

        result.Order.Reports.ShouldAllBe(report => report.UserId == user.Id);
    }

    [Theory, AutoDomainData]
    public async Task GetOrderDetailsForUserAsync_UserOrderIsNull_ReturnsNewDetails(
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IUserRepository userRepository,
        OrderService orderService,
        [Frozen] Order order,
        [Frozen] User user,
        UserOrder userOrder)
    {
        userOrder.Status = UserOrderStatus.None;

        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(order);
        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(user);
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(null, userOrder);
        userOrderRepository.AddAsync(Arg.Any<UserOrder>(), Arg.Any<CancellationToken>())
            .Returns(userOrder);

        var result = await orderService.GetOrderDetailsForUserAsync(Guid.NewGuid(), Guid.NewGuid());

        result.ShouldBeEquivalentTo(userOrder);
    }

    [Theory, AutoDomainData]
    public async Task GetOrderDetailsForCompanyAsync_OrderNotFound_ThrowsNotFound(
        [Frozen] IOrderRepository orderRepository,
        OrderService orderService)
    {
        orderRepository.GetFullOrderDetailsAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Order?)null);

        await orderService.GetOrderDetailsForCompanyAsync(Guid.NewGuid(), Guid.NewGuid()).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task GetOrderDetailsForCompanyAsync_CompanyIsNotTheOwner_ThrowsForbidden(
        [Frozen] IOrderRepository orderRepository,
        OrderService orderService,
        Order order)
    {
        orderRepository.GetFullOrderDetailsAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(order);

        await orderService.GetOrderDetailsForCompanyAsync(Guid.NewGuid(), order.CompanyId).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task GetOrderDetailsForCompanyAsync_ValidFlow_ReturnsOrder(
        [Frozen] IOrderRepository orderRepository,
        OrderService orderService,
        Order order)
    {
        orderRepository.GetFullOrderDetailsAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns(order);

        var result = await orderService.GetOrderDetailsForCompanyAsync(order.CompanyId, order.CompanyId);

        result.Id.ShouldBe(order.Id);
    }
}
