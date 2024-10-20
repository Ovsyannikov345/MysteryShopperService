using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IReportService
    {
        Task<ReportModel> CreateReportAsync(ReportModel reportData, CancellationToken cancellationToken = default);
    }
}