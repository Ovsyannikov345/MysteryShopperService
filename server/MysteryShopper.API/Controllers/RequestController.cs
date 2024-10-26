using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.Services.IServices;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RequestController(IOrderService orderService) : ControllerBase
    {
        [HttpPost("{id}/accept")]
        [Authorize(Roles = "Company")]
        public async Task AcceptRequest(Guid id, CancellationToken cancellationToken)
        {
            await orderService.AcceptRequestAsync(HttpContext.GetIdFromContext(), id, cancellationToken);
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Company")]
        public async Task RejectRequest(Guid id, CancellationToken cancellationToken)
        {
            await orderService.RejectRequestAsync(HttpContext.GetIdFromContext(), id, cancellationToken);
        }
    }
}
