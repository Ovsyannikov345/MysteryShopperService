using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using System.Security.Claims;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SupportRequestController(ISupportRequestService supportRequestService, IMapper mapper) : ControllerBase
    {
        [HttpPost]
        public async Task<SupportRequestViewModel> CreateSupportRequest(string requestText, CancellationToken cancellationToken)
        {
            var userRole = GetRoleFromContext();

            var createdRequest = await supportRequestService.CreateSupportRequestAsync(new SupportRequestModel
            {
                UserId = userRole == "User" ? GetIdFromContext() : null,
                CompanyId = userRole == "Company" ? GetIdFromContext() : null,
                Text = requestText,
            }, cancellationToken);

            return mapper.Map<SupportRequestViewModel>(createdRequest);
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
