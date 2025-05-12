using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.Utilities.Mistral.Models.OrderAnalysis;
using MysteryShopper.BLL.Utilities.Mistral.Services;

namespace MysteryShopper.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class AnalysisController(IMistralService mistralService) : ControllerBase
{
    [HttpGet("order/{orderId}")]
    [Authorize(Roles = "User")]
    public async Task<OrderAnalysisResult> GetOrderAnalysisAsync(Guid orderId, CancellationToken cancellationToken = default)
    {
        var userId = HttpContext.GetIdFromContext();

        return await mistralService.GetOrderAnalysisAsync(orderId, userId, cancellationToken);
    }
}
