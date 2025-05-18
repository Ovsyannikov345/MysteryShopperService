using FluentValidation;
using FluentValidation.Results;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Validators;

namespace MysteryShopperService.BLL.Tests.Validators;

public class AlwaysValidUserValidator : UserRegistrationValidator
{
    public override ValidationResult Validate(ValidationContext<UserRegistrationCredentials> context)
    {
        return new ValidationResult();
    }
}
