using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.ImageServices.IImageServices;

namespace MysteryShopper.API.ImageControllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserImageController(IUserImageService userImageService) : ControllerBase
{
    [HttpGet("{userId}/exists")]
    public async Task<bool> AvatarExists(Guid userId, CancellationToken cancellationToken)
    {
        return await userImageService.ImageExistsAsync(userId, cancellationToken);
    }

    [HttpGet("{userId}")]
    public async Task<FileStreamResult> GetAvatar(Guid userId, CancellationToken cancellationToken)
    {
        var stream = await userImageService.GetImageAsync(userId, cancellationToken);

        return File(stream, $"image/{userImageService.ImageExtension}");
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task UploadAvatar(IFormFile file, CancellationToken cancellationToken)
    {
        var currentUserId = HttpContext.GetIdFromContext();

        await userImageService.UploadImageAsync(currentUserId, file, cancellationToken);
    }
}
