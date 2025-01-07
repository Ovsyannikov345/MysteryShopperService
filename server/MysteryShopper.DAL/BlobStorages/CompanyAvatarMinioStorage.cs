using Microsoft.Extensions.Configuration;
using Minio;
using MysteryShopper.DAL.BlobStorages.IBlobStorages;

namespace MysteryShopper.DAL.BlobStorages;

public class CompanyAvatarMinioStorage(IConfiguration configuration, IMinioClient minioClient)
    : MinioStorage(minioClient, configuration["Minio:BucketNames:Company"]!), ICompanyAvatarStorage
{
}
