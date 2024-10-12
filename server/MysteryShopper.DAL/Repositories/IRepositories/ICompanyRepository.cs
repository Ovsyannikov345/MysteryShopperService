using MysteryShopper.DAL.Entities.Models;
using System.Linq.Expressions;

namespace MysteryShopper.DAL.Repositories.IRepositories
{
    public interface ICompanyRepository : IGenericRepository<Company>
    {
        public Task<Company?> GetCompanyWithReviewsAsync(Expression<Func<Company, bool>> filter, CancellationToken cancellationToken = default);
    }
}
