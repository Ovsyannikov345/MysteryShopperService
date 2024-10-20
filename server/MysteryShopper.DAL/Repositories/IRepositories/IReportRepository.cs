using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IReportRepository : IGenericRepository<Report>
    {
        Task<Report?> GetReportDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
