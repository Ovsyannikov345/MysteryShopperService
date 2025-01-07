using Microsoft.AspNetCore.Http;

namespace MysteryShopper.BLL.ImageServices.IImageServices;

public interface ICompanyImageService
{
    string ImageExtension { get; }

    Task<Stream> GetImageAsync(Guid companyId, CancellationToken cancellationToken = default);

    Task UploadImageAsync(Guid companyId, IFormFile file, CancellationToken cancellationToken = default);
}