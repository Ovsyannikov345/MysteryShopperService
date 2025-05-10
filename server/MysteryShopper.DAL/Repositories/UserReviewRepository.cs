using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using Serilog;

namespace MysteryShopper.DAL.Repositories;

public interface IUserReviewRepository : IGenericRepository<UserReview>;

public class UserReviewRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<UserReview>(context, logger), IUserReviewRepository;
