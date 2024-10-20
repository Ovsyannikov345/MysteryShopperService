using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IReportCorrectionService
    {
        Task<ReportCorrectionModel> CreateReportCorrectionAsync(ReportCorrectionModel correctionData, CancellationToken cancellationToken = default);
    }
}
