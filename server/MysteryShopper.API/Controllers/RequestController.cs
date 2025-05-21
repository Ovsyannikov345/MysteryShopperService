using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.Services;

namespace MysteryShopper.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RequestController(IOrderService orderService) : ControllerBase
{
    [HttpPost("{id}/accept")]
    [Authorize(Roles = "Company")]
    public async Task AcceptRequestAsync(Guid id, CancellationToken cancellationToken)
    {
        await orderService.AcceptRequestAsync(HttpContext.GetIdFromContext(), id, cancellationToken);
    }

    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Company")]
    public async Task RejectRequestAsync(Guid id, CancellationToken cancellationToken)
    {
        await orderService.RejectRequestAsync(HttpContext.GetIdFromContext(), id, cancellationToken);
    }
}
