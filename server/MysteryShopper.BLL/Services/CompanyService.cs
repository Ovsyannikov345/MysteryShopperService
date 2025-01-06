﻿using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.Services
{
    public class CompanyService(ICompanyRepository companyRepository, IMapper mapper) : ICompanyService
    {
        public async Task<Company> GetProfileAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await companyRepository.GetCompanyWithReviewsAsync(c => c.Id == id, cancellationToken) ?? throw new NotFoundException("Company is not found");
        }

        public async Task<Company> UpdateProfileInfoAsync(Guid currentCompanyId, CompanyToUpdateModel companyData, CancellationToken cancellationToken = default)
        {
            if (currentCompanyId != companyData.Id)
            {
                throw new ForbiddenException("You can't update other company's profile");
            }

            var company = await companyRepository.GetByItemAsync(c => c.Id == companyData.Id, cancellationToken) ?? throw new NotFoundException("Company is not found");

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
                    }

                    companyProperty.SetValue(company, value);
                }
            }

            company.ContactPerson = mapper.Map<ContactPerson>(companyData.ContactPerson);

            await companyRepository.UpdateAsync(company, cancellationToken);

            var updatedCompany = await companyRepository.GetCompanyWithReviewsAsync(c => c.Id == company.Id, cancellationToken)
                ?? throw new NotFoundException("Company is not found");

            return updatedCompany;
        }
    }
}
