using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.ImageServices.IImageServices;

namespace MysteryShopper.API.ImageControllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CompanyImageController(ICompanyImageService companyImageService) : ControllerBase
    {
        [HttpGet("{companyId}/exists")]
        public async Task<bool> AvatarExists(Guid companyId, CancellationToken cancellationToken)
        {
            return await companyImageService.ImageExistsAsync(companyId, cancellationToken);
        }

        [HttpGet("{companyId}")]
        public async Task<FileStreamResult> GetAvatar(Guid companyId, CancellationToken cancellationToken)
        {
            var stream = await companyImageService.GetImageAsync(companyId, cancellationToken);

            return File(stream, $"image/{companyImageService.ImageExtension}");
        }

        [HttpPost]
        [Authorize(Roles = "Company")]
        public async Task UploadAvatar(IFormFile file, CancellationToken cancellationToken)
        {
            var currentCompanyId = HttpContext.GetIdFromContext();

            await companyImageService.UploadImageAsync(currentCompanyId, file, cancellationToken);
        }
    }
}
