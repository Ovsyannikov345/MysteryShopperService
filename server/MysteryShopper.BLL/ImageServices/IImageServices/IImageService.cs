using Microsoft.AspNetCore.Http;

namespace MysteryShopper.BLL.ImageServices.IImageServices;

public interface IImageService
{
    string ImageExtension { get; }

    Task<bool> ImageExistsAsync(Guid entityId, CancellationToken cancellationToken = default);

    Task<Stream> GetImageAsync(Guid entityId, CancellationToken cancellationToken = default);

    Task UploadImageAsync(Guid entityId, IFormFile file, CancellationToken cancellationToken = default);
}