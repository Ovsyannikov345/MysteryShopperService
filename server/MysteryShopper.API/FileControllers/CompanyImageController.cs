using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.FileServices;

namespace MysteryShopper.API.FileControllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompanyImageController(ICompanyImageService companyImageService) : ControllerBase
{
    [HttpGet("{companyId}/exists")]
    public async Task<bool> AvatarExists(Guid companyId, CancellationToken cancellationToken)
    {
        return await companyImageService.FileExistsAsync(companyId.ToString(), cancellationToken);
    }

    [HttpGet("{companyId}")]
    public async Task<FileStreamResult> GetAvatar(Guid companyId, CancellationToken cancellationToken)
    {
        var blobObject = await companyImageService.GetFileAsync(companyId.ToString(), cancellationToken);

        return File(blobObject.Stream, $"{blobObject.ContentType}");
    }

    [HttpPost]
    [Authorize(Roles = "Company")]
    public async Task UploadAvatar(IFormFile file, CancellationToken cancellationToken)
    {
        var currentCompanyId = HttpContext.GetIdFromContext();

        await companyImageService.UploadImageAsync(currentCompanyId, file, cancellationToken);
    }
}
