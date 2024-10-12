using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface ICompanyService
    {
        Task<Company> GetProfileAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Company> UpdateProfileInfoAsync(Guid currentCompanyId, Company company, CancellationToken cancellationToken = default);
    }
}