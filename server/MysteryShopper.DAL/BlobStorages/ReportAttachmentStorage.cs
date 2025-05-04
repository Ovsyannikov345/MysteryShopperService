using Microsoft.Extensions.Configuration;
using Minio;

namespace MysteryShopper.DAL.BlobStorages;

public interface IReportAttachmentStorage : IMinioStorage
{
}

public class ReportAttachmentStorage(IConfiguration configuration, IMinioClient minioClient)
    : MinioStorage(minioClient, configuration["Minio:BucketNames:Report"]!), IReportAttachmentStorage
{
}
