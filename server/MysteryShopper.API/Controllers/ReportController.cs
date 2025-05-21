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
public class ReportController(IReportService reportService, IMapper mapper) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<ReportViewModel> CreateReportAsync(ReportToCreateViewModel reportData, CancellationToken cancellationToken)
    {
        var reportToCreate = mapper.Map<ReportModel>(reportData);

        reportToCreate.UserId = HttpContext.GetIdFromContext();

        var createdReport = await reportService.CreateReportAsync(reportToCreate, cancellationToken);

        return mapper.Map<ReportViewModel>(createdReport);
    }
}
