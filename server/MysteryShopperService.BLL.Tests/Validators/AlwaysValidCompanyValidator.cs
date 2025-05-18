using FluentValidation;
using FluentValidation.Results;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Validators;

namespace MysteryShopperService.BLL.Tests.Validators;

class AlwaysValidCompanyValidator : CompanyRegistrationValidator
{
    public override ValidationResult Validate(ValidationContext<CompanyRegistrationCredentials> context)
    {
        return new ValidationResult();
    }
}

