using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class CompanyRegistrationValidator : AbstractValidator<CompanyRegistrationCredentials>
{
    public CompanyRegistrationValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Название компании не должно быть пустым")
            .MinimumLength(3).WithMessage("Название компании должно содержать от 3 до 255 символов")
            .MaximumLength(255).WithMessage("Название компании должно содержать от 3 до 255 символов");

        RuleFor(c => c.Email)
            .NotEmpty().WithMessage("Email компании не должен быть пустым")
            .EmailAddress().WithMessage("Неверный формат почты");

        RuleFor(c => c.Password)
            .NotEmpty().WithMessage("Пароль не должен быть пустым")
            .MaximumLength(20).WithMessage("Пароль должен содержать не более 20 символов")
            .MinimumLength(8).WithMessage("Пароль должен содержать не менее 8 символов");

        RuleFor(c => c.CompanyContactPerson)
            .NotNull().WithMessage("Контактное лицо должно быть указано")
            .SetValidator(new ContactPersonValidator());
    }
}
