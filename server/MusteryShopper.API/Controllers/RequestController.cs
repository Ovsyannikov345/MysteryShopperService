using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;

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
            await orderService.AcceptRequestAsync(GetIdFromContext(), id, cancellationToken);
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Company")]
        public async Task RejectRequest(Guid id, CancellationToken cancellationToken)
        {
            await orderService.RejectRequestAsync(GetIdFromContext(), id, cancellationToken);
        }

        private Guid GetIdFromContext()
        {
            if (!Guid.TryParse(HttpContext.User.FindFirst("Id")?.Value, out Guid id))
            {
                throw new BadRequestException("Valid id is not provided");
            }

            return id;
        }
    }
}
