using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.BLL.FileServices;

namespace MysteryShopper.API.FileControllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserImageController(IUserImageService userImageService) : ControllerBase
{
    [HttpGet("{userId}/exists")]
    public async Task<bool> AvatarExistsAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await userImageService.FileExistsAsync(userId.ToString(), cancellationToken);
    }

    [HttpGet("{userId}")]
    public async Task<FileStreamResult> GetAvatarAsync(Guid userId, CancellationToken cancellationToken)
    {
        var blobObject = await userImageService.GetFileAsync(userId.ToString(), cancellationToken);

        return File(blobObject.Stream, $"{blobObject.ContentType}");
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task UploadAvatarAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var currentUserId = HttpContext.GetIdFromContext();

        await userImageService.UploadImageAsync(currentUserId, file, cancellationToken);
    }
}
