using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class UserRegistrationValidator : AbstractValidator<UserRegistrationCredentials>
{
    public UserRegistrationValidator()
    {
        RuleFor(u => u.Name)
            .NotEmpty().WithMessage("Name should not be empty")
            .MaximumLength(50).WithMessage("Name should be from 3 to 50 symbols")
            .MinimumLength(3).WithMessage("Name should be from 3 to 50 symbols");

        RuleFor(u => u.Surname)
            .NotEmpty().WithMessage("Surname should not be empty")
            .MaximumLength(50).WithMessage("Surname should be from 3 to 50 symbols")
            .MinimumLength(3).WithMessage("Surname should be from 3 to 50 symbols");

        RuleFor(u => u.BirthDate)
            .InclusiveBetween(DateTime.Now.AddYears(-100), DateTime.Now)
            .When(u => u.BirthDate != null);

        RuleFor(u => u.City)
            .MaximumLength(100).WithMessage("City should be from 3 to 50 symbols")
            .MinimumLength(3).WithMessage("City should be from 3 to 50 symbols")
            .When(u => u.City != null);

        RuleFor(u => u.Gender)
            .IsInEnum().WithMessage("Gender should be specified");

        RuleFor(u => u.Phone)
            .NotEmpty().WithMessage("Phone should not be empty")
            .Matches(@"^\+?375\([1-9]{2}\)[0-9\-]{7,14}$").WithMessage("Invalid phone format");

        RuleFor(u => u.Description)
            .MaximumLength(500).WithMessage("Description should be from 3 to 500 symbols")
            .MinimumLength(3).WithMessage("Description should be from 3 to 500 symbols")
            .When(u => u.Description != null);

        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email should not be empty")
            .EmailAddress().WithMessage("Email has invalid format");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Password should not be empty")
            .MaximumLength(20).WithMessage("Password should be shorter than 20 symbols")
            .MinimumLength(8).WithMessage("Password should be longer than 8 symbols");
    }
}
