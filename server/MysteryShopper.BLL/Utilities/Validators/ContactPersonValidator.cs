using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class ContactPersonValidator : AbstractValidator<CompanyContactPersonCredentials>
{
    public ContactPersonValidator()
    {
        RuleFor(c => c.Name)
        .NotEmpty().WithMessage("Имя контактного лица не должно быть пустым")
        .MaximumLength(50).WithMessage("Имя контактного лица должно содержать от 3 до 50 символов")
        .MinimumLength(3).WithMessage("Имя контактного лица должно содержать от 3 до 50 символов");

        RuleFor(c => c.Surname)
            .NotEmpty().WithMessage("Фамилия контактного лица не должна быть пустой")
            .MaximumLength(50).WithMessage("Фамилия контактного лица должна содержать от 3 до 50 символов")
            .MinimumLength(3).WithMessage("Фамилия контактного лица должна содержать от 3 до 50 символов");

        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email контактного лица не должен быть пустым")
            .EmailAddress().WithMessage("Неверный формат почты контактного лица");
    }
}
