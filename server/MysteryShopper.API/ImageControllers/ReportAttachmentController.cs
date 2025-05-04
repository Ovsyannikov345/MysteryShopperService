using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.ImageServices;

namespace MysteryShopper.API.ImageControllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportAttachmentController(IReportAttachmentService reportAttachmentService) : ControllerBase
{
    [HttpGet("report/{reportId}")]
    public async Task<List<string>> GetFileNamesByReportIdAsync(Guid reportId, CancellationToken cancellationToken)
    {
        return await reportAttachmentService.GetFileNamesByPrefixAsync(reportId.ToString(), cancellationToken);
    }

    [HttpGet]
    public async Task<FileStreamResult> GetAttachmentAsync([FromQuery] string fileName, CancellationToken cancellationToken)
    {
        var blobObject = await reportAttachmentService.GetFileAsync(fileName, cancellationToken);

        return File(blobObject.Stream, $"{blobObject.ContentType}");
    }

    [HttpPost("report/{reportId}")]
    [Authorize(Roles = "User")]
    public async Task UploadAttachmentAsync(Guid reportId, IFormFile file, CancellationToken cancellationToken)
    {
        var currentUserId = HttpContext.GetIdFromContext();

        await reportAttachmentService.UploadFileAsync(reportId, currentUserId, file, cancellationToken);
    }
}
