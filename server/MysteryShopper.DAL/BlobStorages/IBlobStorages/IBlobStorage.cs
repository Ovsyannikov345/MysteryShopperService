namespace MysteryShopper.DAL.BlobStorages.IBlobStorages;

public interface IBlobStorage
{
    Task SaveAsync(Stream fileStream, string fileName, string fileExtension, string? filePrefix = null, CancellationToken cancellationToken = default);

    Task<Stream?> GetAsync(string fileName, string fileExtension, CancellationToken cancellationToken = default);

    Task<List<string>> GetFileNamesByPrefixAsync(string prefix, CancellationToken cancellationToken = default);

    Task DeleteFileAsync(string fileName, CancellationToken cancellationToken = default);
}
