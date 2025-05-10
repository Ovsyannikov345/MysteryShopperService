using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface IReportCorrectionRepository : IGenericRepository<ReportCorrection>;

public class ReportCorrectionRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<ReportCorrection>(context, logger), IReportCorrectionRepository;
