using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages;
using MysteryShopper.DAL.Repositories;

namespace MysteryShopper.BLL.FileServices;

public interface IReportAttachmentService : IFileService
{
    Task UploadFileAsync(Guid reportId, Guid userId, IFormFile file, CancellationToken cancellationToken = default);
}

public class ReportAttachmentService(IReportAttachmentStorage reportAttachmentMinioStorage, IReportRepository reportRepository)
    : FileService(reportAttachmentMinioStorage), IReportAttachmentService
{
    protected override string[] SupportedExtensions => [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".pdf", ".doc", ".docx"];

    public async Task UploadFileAsync(Guid reportId, Guid userId, IFormFile file, CancellationToken cancellationToken = default)
    {
        var report = await reportRepository.GetReportDetailsAsync(reportId, cancellationToken)
            ?? throw new NotFoundException("Отчет не найден");

        if (report.UserId != userId)
        {
            throw new ForbiddenException("Вы не можете загрузить файл к этому отчету");
        }

        var fileName = $"{reportId}/{file.FileName}";

        await UploadFileAsync(fileName, file, cancellationToken);
    }
}
