using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.ImageServices.IImageServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages.IBlobStorages;
using MysteryShopper.DAL.Repositories.IRepositories;
using SixLabors.ImageSharp;

namespace MysteryShopper.BLL.ImageServices;

public class CompanyImageService(ICompanyAvatarStorage companyAvatarStorage, ICompanyRepository companyRepository) : ICompanyImageService
{
    private static readonly int _maxFileSizeInMBytes = 2;

    private static readonly int _maxFileSizeInBytes = _maxFileSizeInMBytes * 1024 * 1024;

    private static readonly string[] _allowedToWriteExtensions = [".jpg", ".jpeg", ".png"];

    public string ImageExtension => "jpeg";

    public async Task<Stream> GetImageAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        string fileName = companyId.ToString();

        var stream = await companyAvatarStorage.GetAsync(fileName, ImageExtension, cancellationToken)
            ?? throw new NotFoundException("Image not found");

        return stream;
    }

    public async Task UploadImageAsync(Guid companyId, IFormFile file, CancellationToken cancellationToken = default)
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

        var company = await companyRepository.GetByItemAsync(c => c.Id == companyId)
            ?? throw new NotFoundException("Company is not found");

        var imageName = company.Id.ToString();

        using var fileStream = file.OpenReadStream();

        using var jpegStream = await ConvertToJpegStream(fileStream, cancellationToken);

        await companyAvatarStorage.SaveAsync(jpegStream, imageName, ImageExtension, cancellationToken: cancellationToken);
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
