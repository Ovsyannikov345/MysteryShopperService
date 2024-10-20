using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using System.Security.Claims;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class OrderController(IOrderService orderService, IMapper mapper) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IEnumerable<OrderViewModel>> GetOrderList(CancellationToken cancellationToken)
        {
            var orderList = await orderService.GetOrderListAsync(cancellationToken);

            return mapper.Map<IEnumerable<Order>, IEnumerable<OrderViewModel>>(orderList);
        }

        [HttpGet("my-orders")]
        [Authorize(Roles = "User")]
        public async Task<IEnumerable<UserOrderViewModel>> GetUserOrders(CancellationToken cancellationToken)
        {
            var orderList = await orderService.GetUserOrdersAsync(GetIdFromContext(), cancellationToken);

            return mapper.Map<IEnumerable<UserOrder>, IEnumerable<UserOrderViewModel>>(orderList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetails(Guid id, CancellationToken cancellationToken)
        {
            var role = GetRoleFromContext();

            if (role == "User")
            {
                var userOrder = await orderService.GetOrderDetailsForUserAsync(GetIdFromContext(), id, cancellationToken);

                return Ok(mapper.Map<UserOrderViewModel>(userOrder));
            }

            return Ok(await orderService.GetOrderDetailsForCompanyAsync(GetIdFromContext(), id, cancellationToken));
        }

        [HttpPost]
        [Authorize(Roles = "Company")]
        public async Task<OrderViewModel> CreateOrder(OrderToCreateViewModel orderData, CancellationToken cancellationToken)
        {
            var orderToCreate = mapper.Map<OrderModel>(orderData);

            orderToCreate.CompanyId = GetIdFromContext();

            var createdOrder = await orderService.CreateOrderAsync(orderToCreate, cancellationToken);

            return mapper.Map<OrderViewModel>(createdOrder);
        }

        [HttpPost("{id}/request")]
        [Authorize(Roles = "User")]
        public async Task SendOrderRequest(Guid id, CancellationToken cancellationToken)
        {
            await orderService.SendOrderRequestAsync(GetIdFromContext(), id, cancellationToken);
        }

        private Guid GetIdFromContext()
        {
            if (!Guid.TryParse(HttpContext.User.FindFirst("Id")?.Value, out Guid id))
            {
                throw new BadRequestException("Valid id is not provided");
            }

            return id;
        }

        private string GetRoleFromContext()
        {
            var role = HttpContext.User.FindFirstValue(ClaimTypes.Role)
                ?? throw new ForbiddenException("Role is not provided in request");

            return role;
        }
    }
}
