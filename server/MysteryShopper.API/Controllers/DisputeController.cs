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
    public class DisputeController(IDisputeService disputeService, IMapper mapper) : ControllerBase
    {
        [HttpGet("order/{id}")]
        [Authorize(Roles = "Company")]
        public async Task<IEnumerable<DisputeViewModel>> GetOrderDisputes(Guid id, CancellationToken cancellationToken)
        {
            var disputes = await disputeService.GetOrderDisputesAsync(HttpContext.GetIdFromContext(), id, cancellationToken);

            return mapper.Map<IEnumerable<DisputeModel>, IEnumerable<DisputeViewModel>>(disputes);
        }

        [HttpGet("user")]
        [Authorize(Roles = "User")]
        public async Task<IEnumerable<DisputeViewModel>> GetUserDisputes(CancellationToken cancellationToken)
        {
            var disputes = await disputeService.GetUserDisputesAsync(HttpContext.GetIdFromContext(), cancellationToken);

            return mapper.Map<IEnumerable<DisputeModel>, IEnumerable<DisputeViewModel>>(disputes);
        }

        [HttpPost]
        public async Task<DisputeViewModel> CreateDispute(DisputeToCreateViewModel disputeData, CancellationToken cancellationToken)
        {
            var disputeToCreate = mapper.Map<DisputeModel>(disputeData);

            var dispute = await disputeService.CreateDisputeAsync(disputeToCreate, cancellationToken);

            return mapper.Map<DisputeViewModel>(dispute);
        }

        [HttpPut("{id}/user")]
        [Authorize(Roles = "User")]
        public async Task<DisputeViewModel> AddUserText(Guid id, string text, CancellationToken cancellationToken)
        {
            var updatedDispute = await disputeService.AddUserDisputeTextAsync(id, HttpContext.GetIdFromContext(), text, cancellationToken);

            return mapper.Map<DisputeViewModel>(updatedDispute);
        }

        [HttpPut("{id}/company")]
        [Authorize(Roles = "Company")]
        public async Task<DisputeViewModel> AddCompanyText(Guid id, string text, CancellationToken cancellationToken)
        {
            var updatedDispute = await disputeService.AddCompanyDisputeTextAsync(id, HttpContext.GetIdFromContext(), text, cancellationToken);

            return mapper.Map<DisputeViewModel>(updatedDispute);
        }
    }
}
