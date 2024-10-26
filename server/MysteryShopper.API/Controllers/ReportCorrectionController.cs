using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Services.IServices;
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
        public async Task<ReportCorrectionViewModel> CreateReportCorrection(ReportCorrectionToCreateViewModel correctionData, CancellationToken cancellationToken)
        {
            var correctionToCreate = mapper.Map<ReportCorrectionModel>(correctionData);

            correctionToCreate.CompanyId = HttpContext.GetIdFromContext();

            var createdCorrection = await reportCorrectionService.CreateReportCorrectionAsync(correctionToCreate, cancellationToken);

            return mapper.Map<ReportCorrectionViewModel>(createdCorrection);
        }
    }
}
