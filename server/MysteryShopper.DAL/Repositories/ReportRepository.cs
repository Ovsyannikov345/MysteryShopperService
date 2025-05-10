using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface IReportRepository : IGenericRepository<Report>
{
    Task<Report?> GetReportDetailsAsync(Guid id, CancellationToken cancellationToken = default);
}

public class ReportRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Report>(context, logger), IReportRepository
{
    private readonly MysteryShopperDbContext _context = context;

    public async Task<Report?> GetReportDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Reports.AsNoTracking()
            .Include(r => r.Order)
            .Include(r => r.ReportCorrection)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }
}
