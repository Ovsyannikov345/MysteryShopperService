using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.Services
{
    public class CompanyService(ICompanyRepository companyRepository) : ICompanyService
    {
        public async Task<Company> GetProfileAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await companyRepository.GetCompanyWithReviewsAsync(c => c.Id == id, cancellationToken) ?? throw new NotFoundException("Company is not found");
        }

        public async Task<Company> UpdateProfileInfoAsync(Guid currentCompanyId, Company company, CancellationToken cancellationToken = default)
        {
            if (currentCompanyId != company.Id)
            {
                throw new ForbiddenException("You can't update other company's profile");
            }

            if (await companyRepository.GetByItemAsync(c => c.Id == company.Id, cancellationToken) == null)
            {
                throw new NotFoundException("Company is not found");
            }

            return await companyRepository.UpdateAsync(company, cancellationToken);
        }
    }
}
