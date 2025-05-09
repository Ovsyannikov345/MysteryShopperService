﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Querying;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Utilities.Pagination;

namespace MysteryShopper.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class OrderController(IOrderService orderService, IMapper mapper) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "User")]
    public async Task<PagedResult<OrderViewModel>> GetOrderList(
        [FromQuery] OrderSortOptions sortOption,
        [FromQuery] OrderQueryFilter queryFilter,
        [FromQuery] Pagination pagination,
        CancellationToken cancellationToken)
    {
        var orders = await orderService.GetOrderListAsync(HttpContext.GetIdFromContext(), sortOption, queryFilter, pagination, cancellationToken);

        return mapper.Map<PagedResult<Order>, PagedResult<OrderViewModel>>(orders);
    }

    [HttpGet("in-progress")]
    [Authorize(Roles = "User")]
    public async Task<IEnumerable<UserOrderViewModel>> GetUserOrders(CancellationToken cancellationToken)
    {
        var orderList = await orderService.GetUserOrdersAsync(HttpContext.GetIdFromContext(), cancellationToken);

        return mapper.Map<IEnumerable<UserOrder>, IEnumerable<UserOrderViewModel>>(orderList);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Company")]
    public async Task<IEnumerable<OrderViewModel>> GetCompanyOrders(CancellationToken cancellationToken)
    {
        var orders = await orderService.GetCompanyOrdersAsync(HttpContext.GetIdFromContext(), cancellationToken);

        return mapper.Map<IEnumerable<OrderModel>, IEnumerable<OrderViewModel>>(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderDetails(Guid id, CancellationToken cancellationToken)
    {
        var role = HttpContext.GetRoleFromContext();

        if (role == "User")
        {
            var userOrder = await orderService.GetOrderDetailsForUserAsync(HttpContext.GetIdFromContext(), id, cancellationToken);

            return Ok(mapper.Map<UserOrderViewModel>(userOrder));
        }

        return Ok(await orderService.GetOrderDetailsForCompanyAsync(HttpContext.GetIdFromContext(), id, cancellationToken));
    }

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<OrderViewModel> CreateOrder(OrderToCreateViewModel orderData, CancellationToken cancellationToken)
    {
        var orderToCreate = mapper.Map<OrderModel>(orderData);

        orderToCreate.CompanyId = HttpContext.GetIdFromContext();

        var createdOrder = await orderService.CreateOrderAsync(orderToCreate, cancellationToken);

        return mapper.Map<OrderViewModel>(createdOrder);
    }

    [HttpPost("{id}/request")]
    [Authorize(Roles = "User")]
    public async Task SendOrderRequest(Guid id, CancellationToken cancellationToken)
    {
        await orderService.SendOrderRequestAsync(HttpContext.GetIdFromContext(), id, cancellationToken);
    }

    [HttpPost("{id}/complete")]
    [Authorize(Roles = "Company")]
    public async Task CompleteOrder(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        await orderService.AcceptOrderAsync(HttpContext.GetIdFromContext(), userId, id, cancellationToken);
    }

    [HttpPost("{id}/expire")]
    [Authorize(Roles = "Company")]
    public async Task ExpireOrder(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        await orderService.ExpireOrderAsync(HttpContext.GetIdFromContext(), userId, id, cancellationToken);
    }

    [HttpPost("{id}/finish")]
    [Authorize(Roles = "Company")]
    public async Task FinishOrder(Guid id, CancellationToken cancellationToken)
    {
        await orderService.FinishOrderAsync(HttpContext.GetIdFromContext(), id, cancellationToken);
    }
}
