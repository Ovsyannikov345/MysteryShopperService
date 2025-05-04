using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages;
using MysteryShopper.DAL.Repositories.IRepositories;
using SixLabors.ImageSharp;

namespace MysteryShopper.BLL.ImageServices;

public interface IUserImageService : IFileService
{
    Task UploadImageAsync(Guid userId, IFormFile file, CancellationToken cancellationToken = default);
}

public class UserImageService(IUserAvatarStorage userAvatarStorage, IUserRepository userRepository)
    : FileService(userAvatarStorage), IUserImageService
{
    protected override string[] SupportedExtensions => [".jpg", ".jpeg", ".png"];

    public async Task UploadImageAsync(Guid userId, IFormFile file, CancellationToken cancellationToken = default)
    {
        _ = await userRepository.GetAsync(c => c.Id == userId, disableTracking: true, cancellationToken)
            ?? throw new NotFoundException("User is not found");

        if (file == null || file.Length == 0)
        {
            throw new BadRequestException("File is empty");
        }

        var fileExtension = Path.GetExtension(file.FileName).ToLower();

        if (!SupportedExtensions.Contains(fileExtension))
        {
            throw new BadRequestException($"Acceptable formats: {string.Join(", ", SupportedExtensions)}");
        }

        if (file.Length > MaxFileSizeInBytes)
        {
            throw new BadRequestException($"Max file size is {MaxFileSizeInMBytes} Mb");
        }

        using var fileStream = file.OpenReadStream();

        using var jpegStream = await ConvertToJpegStream(fileStream, cancellationToken);

        await Storage.SaveObjectAsync(jpegStream, userId.ToString(), file.ContentType, cancellationToken);
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
