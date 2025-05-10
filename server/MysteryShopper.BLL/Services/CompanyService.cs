using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;

namespace MysteryShopper.BLL.Services;

public interface ICompanyService
{
    Task<Company> GetProfileAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Company> UpdateProfileInfoAsync(Guid currentCompanyId, CompanyToUpdateModel companyData, CancellationToken cancellationToken = default);
}

public class CompanyService(ICompanyRepository companyRepository, IMapper mapper) : ICompanyService
{
    public async Task<Company> GetProfileAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await companyRepository.GetCompanyWithReviewsAsync(c => c.Id == id, cancellationToken)
            ?? throw new NotFoundException("Company is not found");
    }

    public async Task<Company> UpdateProfileInfoAsync(Guid currentCompanyId, CompanyToUpdateModel companyData, CancellationToken cancellationToken = default)
    {
        if (currentCompanyId != companyData.Id)
        {
            throw new ForbiddenException("You can't update other company's profile");
        }

        var company = await companyRepository.GetAsync(c => c.Id == companyData.Id, disableTracking: false, cancellationToken)
            ?? throw new NotFoundException("Company is not found");

        var companyProperties = typeof(Company).GetProperties();

        foreach (var modelProperty in typeof(CompanyToUpdateModel).GetProperties())
        {
            if (modelProperty.Name == nameof(Company.ContactPerson))
            {
                continue;
            }

            var companyProperty = Array.Find(companyProperties, p => p.Name == modelProperty.Name);

            if (companyProperty is not null && companyProperty.CanWrite)
            {
                var value = modelProperty.GetValue(companyData);

                if (value is string stringValue && string.IsNullOrWhiteSpace(stringValue))
                {
                    companyProperty.SetValue(company, null);
                    continue;
                }

                companyProperty.SetValue(company, value);
            }
        }

        company.ContactPerson = mapper.Map<ContactPerson>(companyData.ContactPerson);

        await companyRepository.UpdateAsync(company, cancellationToken);

        return await GetProfileAsync(company.Id, cancellationToken);
    }
}
