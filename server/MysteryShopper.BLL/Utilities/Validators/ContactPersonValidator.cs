using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class ContactPersonValidator : AbstractValidator<CompanyContactPersonCredentials>
{
    public ContactPersonValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Contact person name should not be empty")
            .MaximumLength(50).WithMessage("Contact person name should be from 3 to 50 symbols")
            .MinimumLength(3).WithMessage("Contact person name should be from 3 to 50 symbols");

        RuleFor(c => c.Surname)
            .NotEmpty().WithMessage("Contact person surname should not be empty")
            .MaximumLength(50).WithMessage("Contact person surname should be from 3 to 50 symbols")
            .MinimumLength(3).WithMessage("Contact person surname should be from 3 to 50 symbols");

        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Contact person email should not be empty")
            .EmailAddress().WithMessage("Contact person email has invalid format");
    }
}
