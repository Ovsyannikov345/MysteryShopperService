using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SupportRequestController(ISupportRequestService supportRequestService, IMapper mapper) : ControllerBase
    {
        [HttpPost]
        public async Task<SupportRequestViewModel> CreateSupportRequest([FromBody] string requestText, CancellationToken cancellationToken)
        {
            var userRole = HttpContext.GetRoleFromContext();

            var createdRequest = await supportRequestService.CreateSupportRequestAsync(new SupportRequestModel
            {
                UserId = userRole == "User" ? HttpContext.GetIdFromContext() : null,
                CompanyId = userRole == "Company" ? HttpContext.GetIdFromContext() : null,
                Text = requestText,
            }, cancellationToken);

            return mapper.Map<SupportRequestViewModel>(createdRequest);
        }
    }
}
