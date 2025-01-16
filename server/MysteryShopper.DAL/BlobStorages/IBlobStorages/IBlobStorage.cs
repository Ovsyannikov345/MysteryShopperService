namespace MysteryShopper.DAL.BlobStorages.IBlobStorages;

public interface IBlobStorage
{
    Task<bool> ObjectExistsAsync(string name, string? prefix = null, CancellationToken cancellationToken = default);

    Task SaveObjectAsync(Stream fileStream, string name, string? prefix = null, string contentType = "image/jpeg", CancellationToken cancellationToken = default);

    Task<Stream?> GetObjectAsync(string objectName, CancellationToken cancellationToken = default);

    Task<List<string>> GetObjectNamesByPrefixAsync(string prefix, CancellationToken cancellationToken = default);

    Task DeleteObjectAsync(string objectName, CancellationToken cancellationToken = default);
}
