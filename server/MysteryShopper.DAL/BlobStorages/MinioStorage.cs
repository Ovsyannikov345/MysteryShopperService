using Minio;
using Minio.DataModel.Args;
using MysteryShopper.DAL.BlobStorages.Entities;

namespace MysteryShopper.DAL.BlobStorages
{
    public interface IMinioStorage
    {
        Task DeleteObjectAsync(string name, CancellationToken cancellationToken = default);

        Task<BlobObject?> GetObjectAsync(string name, CancellationToken cancellationToken = default);

        Task<List<string>> GetObjectNamesByPrefixAsync(string prefix, CancellationToken cancellationToken = default);

        Task<bool> ObjectExistsAsync(string name, CancellationToken cancellationToken = default);

        Task SaveObjectAsync(Stream fileStream, string name, string contentType, CancellationToken cancellationToken = default);
    }

    public class MinioStorage(IMinioClient minioClient, string bucketName) : IMinioStorage
    {
        protected readonly IMinioClient _minioClient = minioClient;

        protected readonly string _bucketName = bucketName;

        public async Task<bool> ObjectExistsAsync(string name, CancellationToken cancellationToken = default)
        {
            await EnsureBucketCreatedAsync(cancellationToken);

            try
            {
                await _minioClient.StatObjectAsync(new StatObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(name), cancellationToken);
            }
            catch
            {
                return false;
            }

            return true;
        }

        public async Task SaveObjectAsync(
            Stream fileStream,
            string name,
            string contentType,
            CancellationToken cancellationToken = default)
        {
            await EnsureBucketCreatedAsync(cancellationToken);

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(name)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs, cancellationToken);
        }

        public async Task<BlobObject?> GetObjectAsync(string name, CancellationToken cancellationToken = default)
        {
            try
            {
                await _minioClient.StatObjectAsync(new StatObjectArgs()
                    .WithBucket(_bucketName)
                    .WithObject(name), cancellationToken);
            }
            catch
            {
                return null;
            }

            var objectStream = new MemoryStream();

            var blobObject = await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(name)
                .WithCallbackStream((stream) => stream.CopyTo(objectStream)), cancellationToken);

            objectStream.Position = 0;

            return new()
            {
                Name = blobObject.ObjectName,
                ContentType = blobObject.ContentType,
                Stream = objectStream,
            };
        }

        public async Task<List<string>> GetObjectNamesByPrefixAsync(string prefix, CancellationToken cancellationToken = default)
        {
            await EnsureBucketCreatedAsync(cancellationToken);

            var keys = new List<string>();

            await foreach (var item in _minioClient.ListObjectsEnumAsync(new ListObjectsArgs()
                .WithBucket(_bucketName)
                .WithPrefix($"{prefix}/"), cancellationToken))
            {
                keys.Add(item.Key);
            }

            return keys;
        }

        public async Task DeleteObjectAsync(string name, CancellationToken cancellationToken = default)
        {
            await EnsureBucketCreatedAsync(cancellationToken);

            await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(name), cancellationToken);
        }

        private async Task EnsureBucketCreatedAsync(CancellationToken cancellationToken = default)
        {
            bool isBucketExists = await _minioClient.BucketExistsAsync(new BucketExistsArgs()
                .WithBucket(_bucketName), cancellationToken);

            if (!isBucketExists)
            {
                await _minioClient.MakeBucketAsync(new MakeBucketArgs()
                    .WithBucket(_bucketName), cancellationToken);
            }
        }
    }
}
