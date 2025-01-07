using Microsoft.Extensions.Configuration;
using Minio;
using MysteryShopper.DAL.BlobStorages.IBlobStorages;

namespace MysteryShopper.DAL.BlobStorages;

public class UserAvatarMinioStorage(IConfiguration configuration, IMinioClient minioClient)
    : MinioStorage(minioClient, configuration["Minio:BucketNames:User"]!), IUserAvatarStorage
{
}
