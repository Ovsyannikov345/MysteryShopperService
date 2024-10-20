using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportCorrectionController(IReportCorrectionService reportCorrectionService, IMapper mapper) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "Company")]
        public async Task<ReportCorrectionViewModel> CreateReportCorrection(Guid id, ReportCorrectionToCreateViewModel correctionData, CancellationToken cancellationToken)
        {
            var correctionToCreate = mapper.Map<ReportCorrectionModel>(correctionData);

            correctionToCreate.CompanyId = GetIdFromContext();

            var createdCorrection = await reportCorrectionService.CreateReportCorrectionAsync(correctionToCreate, cancellationToken);

            return mapper.Map<ReportCorrectionViewModel>(createdCorrection);
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
