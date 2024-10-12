using MysteryShopper.DAL.Entities.Models;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        public Task<User?> GetUserWithReviewsAsync(Expression<Func<User, bool>> filter, CancellationToken cancellationToken = default);
    }
}
