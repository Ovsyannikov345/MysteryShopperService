using Minio;
using Minio.DataModel.Args;
using MysteryShopper.DAL.BlobStorages.IBlobStorages;

namespace MysteryShopper.DAL.BlobStorages
{
    public class MinioStorage(IMinioClient minioClient, string bucketName) : IBlobStorage
    {
        protected readonly IMinioClient _minioClient = minioClient;

        protected readonly string _bucketName = bucketName;

        public async Task SaveAsync(
            Stream fileStream,
            string fileName,
            string fileExtension,
            string? filePrefix = null,
            CancellationToken cancellationToken = default)
        {
            await EnsureBucketCreated(cancellationToken);

            var objectName = $"{fileName}.{fileExtension}";

            if (!string.IsNullOrEmpty(filePrefix))
            {
                objectName = $"{filePrefix}/{objectName}";
            }

            var contentType = $"image/{fileExtension}";

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithStreamData(fileStream)
                .WithObjectSize(fileStream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs, cancellationToken);
        }

        public async Task<Stream?> GetAsync(string fileName, string fileExtension, CancellationToken cancellationToken = default)
        {
            var objectName = $"{fileName}.{fileExtension}";

            try
            {
                await _minioClient.StatObjectAsync(
                new StatObjectArgs().WithBucket(_bucketName).WithObject(objectName), cancellationToken);
            }
            catch
            {
                return null;
            }

            var objectStream = new MemoryStream();

            await _minioClient.GetObjectAsync(new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithCallbackStream((stream) => stream.CopyTo(objectStream)), cancellationToken);

            objectStream.Position = 0;

            return objectStream;
        }

        public async Task<List<string>> GetFileNamesByPrefixAsync(string prefix, CancellationToken cancellationToken = default)
        {
            await EnsureBucketCreated(cancellationToken);

            var imageKeys = new List<string>();

            await foreach (var item in _minioClient.ListObjectsEnumAsync(
                new ListObjectsArgs().WithBucket(_bucketName).WithPrefix($"{prefix}/"), cancellationToken))
            {
                imageKeys.Add(item.Key.Split("/")[1]);
            }

            return imageKeys;
        }

        public async Task DeleteFileAsync(string fileName, CancellationToken cancellationToken = default)
        {
            await EnsureBucketCreated(cancellationToken);

            await _minioClient.RemoveObjectAsync(new RemoveObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileName), cancellationToken);
        }

        private async Task EnsureBucketCreated(CancellationToken cancellationToken = default)
        {
            bool isBucketExists = await _minioClient.BucketExistsAsync(
                new BucketExistsArgs().WithBucket(_bucketName), cancellationToken);

            if (!isBucketExists)
            {
                await _minioClient.MakeBucketAsync(
                    new MakeBucketArgs().WithBucket(_bucketName), cancellationToken);
            }
        }
    }
}
