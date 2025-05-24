using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class UserRegistrationValidator : AbstractValidator<UserRegistrationCredentials>
{
    public UserRegistrationValidator()
    {
        RuleFor(u => u.Name)
            .NotEmpty().WithMessage("Имя не должно быть пустым")
            .MaximumLength(50).WithMessage("Имя должно содержать от 3 до 50 символов")
            .MinimumLength(3).WithMessage("Имя должно содержать от 3 до 50 символов");

        RuleFor(u => u.Surname)
            .NotEmpty().WithMessage("Фамилия не должна быть пустой")
            .MaximumLength(50).WithMessage("Фамилия должна содержать от 3 до 50 символов")
            .MinimumLength(3).WithMessage("Фамилия должна содержать от 3 до 50 символов");

        RuleFor(u => u.BirthDate)
            .InclusiveBetween(DateTime.Now.AddYears(-100), DateTime.Now)
            .When(u => u.BirthDate != null)
            .WithMessage("Некорректная дата рождения");

        RuleFor(u => u.City)
            .MaximumLength(100).WithMessage("Город должен содержать от 3 до 50 символов")
            .MinimumLength(3).WithMessage("Город должен содержать от 3 до 50 символов")
            .When(u => u.City != null);

        RuleFor(u => u.Gender)
            .IsInEnum().WithMessage("Пол должен быть указан");

        RuleFor(u => u.Phone)
            .NotEmpty().WithMessage("Телефон не должен быть пустым")
            .Matches(@"^\+?375\([1-9]{2}\)[0-9\-]{7,14}$").WithMessage("Неверный формат номера телефона");

        RuleFor(u => u.Description)
            .MaximumLength(500).WithMessage("Описание должно содержать от 3 до 500 символов")
            .MinimumLength(3).WithMessage("Описание должно содержать от 3 до 500 символов")
            .When(u => u.Description != null);

        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("Email не должен быть пустым")
            .EmailAddress().WithMessage("Неверный формат email");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("Пароль не должен быть пустым")
            .MaximumLength(20).WithMessage("Пароль должен содержать не более 20 символов")
            .MinimumLength(8).WithMessage("Пароль должен содержать не менее 8 символов");
    }
}
