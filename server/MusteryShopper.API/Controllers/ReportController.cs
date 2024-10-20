using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportController(IReportService reportService, IMapper mapper) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ReportViewModel> CreateReport(ReportToCreateViewModel reportData, CancellationToken cancellationToken)
        {
            var reportToCreate = mapper.Map<ReportModel>(reportData);

            reportToCreate.UserId = GetIdFromContext();

            var createdReport = await reportService.CreateReportAsync(reportToCreate, cancellationToken);

            return mapper.Map<ReportViewModel>(createdReport);
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
