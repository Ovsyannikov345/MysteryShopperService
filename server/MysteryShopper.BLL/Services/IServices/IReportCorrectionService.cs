using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IReportCorrectionService
    {
        Task<ReportCorrectionModel> CreateReportCorrectionAsync(ReportCorrectionModel correctionData, Guid currentCompanyId, CancellationToken cancellationToken = default);
    }
}
