using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class CompanyRegistrationValidator : AbstractValidator<CompanyRegistrationCredentials>
{
    public CompanyRegistrationValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Company name should not be empty")
            .MinimumLength(3).WithMessage("Company name should be from 3 to 255 symbols")
            .MaximumLength(255).WithMessage("Company name should be from 3 to 255 symbols");

        RuleFor(c => c.Email)
            .NotEmpty().WithMessage("Company email should not be empty")
            .EmailAddress().WithMessage("Company email has invalid format");

        RuleFor(c => c.Password)
            .NotEmpty().WithMessage("Password should not be empty")
            .MaximumLength(20).WithMessage("Password should be shorter than 20 symbols")
            .MinimumLength(8).WithMessage("Password should be longer than 8 symbols");

        RuleFor(c => c.CompanyContactPerson)
            .NotNull().WithMessage("Contact person should be defined")
            .SetValidator(new ContactPersonValidator());
    }
}
