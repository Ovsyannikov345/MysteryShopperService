using Microsoft.Extensions.Configuration;
using Minio;

namespace MysteryShopper.DAL.BlobStorages;

public interface ICompanyAvatarStorage : IMinioStorage;

public class CompanyAvatarStorage(IConfiguration configuration, IMinioClient minioClient)
    : MinioStorage(minioClient, configuration["Minio:BucketNames:Company"]!), ICompanyAvatarStorage
{
}
