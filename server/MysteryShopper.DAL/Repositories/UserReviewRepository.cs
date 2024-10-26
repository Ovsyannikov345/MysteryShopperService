using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class UserReviewRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<UserReview>(context, logger), IUserReviewRepository;
}
