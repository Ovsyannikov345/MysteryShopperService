using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.ImageServices.IImageServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages.IBlobStorages;
using SixLabors.ImageSharp;

namespace MysteryShopper.BLL.ImageServices;

public class ImageService(IBlobStorage imageStorage) : IImageService
{
    private static readonly int _maxFileSizeInMBytes = 2;

    private static readonly int _maxFileSizeInBytes = _maxFileSizeInMBytes * 1024 * 1024;

    private static readonly string[] _allowedToWriteExtensions = [".jpg", ".jpeg", ".png"];

    public string ImageExtension => "jpeg";

    public async Task<Stream> GetImageAsync(Guid entityId, CancellationToken cancellationToken = default)
    {
        string fileName = entityId.ToString();

        var stream = await imageStorage.GetObjectAsync(fileName, cancellationToken)
            ?? throw new NotFoundException("Image not found");

        return stream;
    }

    public virtual async Task UploadImageAsync(Guid entityId, IFormFile file, CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
        {
            throw new BadRequestException("File is empty");
        }

        var fileExtension = Path.GetExtension(file.FileName).ToLower();

        if (!_allowedToWriteExtensions.Contains(fileExtension))
        {
            throw new BadRequestException($"Acceptable formats: {string.Join(", ", _allowedToWriteExtensions)}");
        }

        if (file.Length > _maxFileSizeInBytes)
        {
            throw new BadRequestException($"Max file size is {_maxFileSizeInMBytes} Mb");
        }

        var imageName = entityId.ToString();

        using var fileStream = file.OpenReadStream();

        using var jpegStream = await ConvertToJpegStream(fileStream, cancellationToken);

        await imageStorage.SaveObjectAsync(jpegStream, imageName, cancellationToken: cancellationToken);
    }

    private static async Task<MemoryStream> ConvertToJpegStream(Stream fileStream, CancellationToken cancellationToken = default)
    {
        var jpegStream = new MemoryStream();

        using (var image = await Image.LoadAsync(fileStream, cancellationToken))
        {
            await image.SaveAsJpegAsync(jpegStream, cancellationToken);
        }

        jpegStream.Position = 0;

        return jpegStream;
    }
}
