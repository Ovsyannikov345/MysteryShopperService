using MysteryShopper.BLL.Dto;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface ICompanyService
    {
        Task<Company> GetProfileAsync(Guid id, CancellationToken cancellationToken = default);

        Task<Company> UpdateProfileInfoAsync(Guid currentCompanyId, CompanyToUpdateModel companyData, CancellationToken cancellationToken = default);
    }
}