using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages;
using MysteryShopper.DAL.Repositories;
using SixLabors.ImageSharp;

namespace MysteryShopper.BLL.FileServices;

public interface ICompanyImageService : IFileService
{
    Task UploadImageAsync(Guid companyId, IFormFile file, CancellationToken cancellationToken = default);
}

public class CompanyImageService(ICompanyAvatarStorage companyAvatarStorage, ICompanyRepository companyRepository)
    : FileService(companyAvatarStorage), ICompanyImageService
{
    protected override string[] SupportedExtensions => [".jpg", ".jpeg", ".png"];

    public async Task UploadImageAsync(Guid companyId, IFormFile file, CancellationToken cancellationToken = default)
    {
        _ = await companyRepository.GetAsync(c => c.Id == companyId, disableTracking: true, cancellationToken)
            ?? throw new NotFoundException("Компания не найдена");

        if (file == null || file.Length == 0)
        {
            throw new BadRequestException("Файл пуст");
        }

        var fileExtension = Path.GetExtension(file.FileName).ToLower();

        if (!SupportedExtensions.Contains(fileExtension))
        {
            throw new BadRequestException($"Допустимые форматы: {string.Join(", ", SupportedExtensions)}");
        }

        if (file.Length > MaxFileSizeInBytes)
        {
            throw new BadRequestException($"Максимальный размер файла: {MaxFileSizeInMBytes} МБ");
        }

        using var fileStream = file.OpenReadStream();

        using var jpegStream = await ConvertToJpegStream(fileStream, cancellationToken);

        await Storage.SaveObjectAsync(jpegStream, companyId.ToString(), file.ContentType, cancellationToken);
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
