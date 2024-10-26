using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class CompanyReviewRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<CompanyReview>(context, logger), ICompanyReviewRepository;
}
