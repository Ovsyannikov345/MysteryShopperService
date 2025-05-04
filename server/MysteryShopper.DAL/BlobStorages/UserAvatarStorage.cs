using Microsoft.Extensions.Configuration;
using Minio;

namespace MysteryShopper.DAL.BlobStorages;

public interface IUserAvatarStorage : IMinioStorage
{
}

public class UserAvatarStorage(IConfiguration configuration, IMinioClient minioClient)
    : MinioStorage(minioClient, configuration["Minio:BucketNames:User"]!), IUserAvatarStorage
{
}
