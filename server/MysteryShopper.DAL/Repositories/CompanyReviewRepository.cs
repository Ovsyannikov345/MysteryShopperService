using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface ICompanyReviewRepository : IGenericRepository<CompanyReview>;

public class CompanyReviewRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<CompanyReview>(context, logger), ICompanyReviewRepository;
