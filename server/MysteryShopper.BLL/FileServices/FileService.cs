using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages;
using MysteryShopper.DAL.BlobStorages.Entities;

namespace MysteryShopper.BLL.FileServices;

public interface IFileService
{
    Task<bool> FileExistsAsync(string fileName, CancellationToken cancellationToken = default);

    Task<BlobObject> GetFileAsync(string fileName, CancellationToken cancellationToken = default);

    Task<List<string>> GetFileNamesByPrefixAsync(string prefix, CancellationToken cancellationToken = default);

    Task UploadFileAsync(string fileName, IFormFile file, CancellationToken cancellationToken = default);
}

public abstract class FileService(IMinioStorage imageStorage) : IFileService
{
    protected virtual int MaxFileSizeInMBytes => 10;

    protected virtual int MaxFileSizeInBytes => MaxFileSizeInMBytes * 1024 * 1024;

    protected abstract string[] SupportedExtensions { get; }

    protected IMinioStorage Storage => imageStorage;

    public virtual async Task<bool> FileExistsAsync(string fileName, CancellationToken cancellationToken = default)
    {
        return await Storage.ObjectExistsAsync(fileName, cancellationToken);
    }

    public virtual async Task<List<string>> GetFileNamesByPrefixAsync(string prefix, CancellationToken cancellationToken = default)
    {
        return await Storage.GetObjectNamesByPrefixAsync(prefix, cancellationToken);
    }

    public virtual async Task<BlobObject> GetFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        return await Storage.GetObjectAsync(fileName, cancellationToken)
            ?? throw new NotFoundException("File not found");
    }

    public virtual async Task UploadFileAsync(string fileName, IFormFile file, CancellationToken cancellationToken = default)
    {
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

        await Storage.SaveObjectAsync(fileStream, fileName, file.ContentType, cancellationToken);
    }
}
