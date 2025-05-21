using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;

namespace MysteryShopper.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportCorrectionController(IReportCorrectionService reportCorrectionService, IMapper mapper) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task<ReportCorrectionViewModel> CreateReportCorrectionAsync(ReportCorrectionToCreateViewModel correctionData, CancellationToken cancellationToken)
    {
        var correctionToCreate = mapper.Map<ReportCorrectionModel>(correctionData);

        var companyId = HttpContext.GetIdFromContext();

        var createdCorrection = await reportCorrectionService.CreateReportCorrectionAsync(correctionToCreate, companyId, cancellationToken);

        return mapper.Map<ReportCorrectionViewModel>(createdCorrection);
    }
}
