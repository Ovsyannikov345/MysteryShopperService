using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class ReportValidator : AbstractValidator<ReportModel>
{
    public ReportValidator()
    {
        RuleFor(report => report.Title)
            .NotEmpty().WithMessage("Заголовок обязателен для заполнения.")
            .MaximumLength(100).WithMessage("Заголовок не должен превышать 100 символов.");

        RuleFor(report => report.Description)
            .NotEmpty().WithMessage("Описание обязательно для заполнения.");

        RuleFor(report => report.Grade)
            .InclusiveBetween((short)0, (short)5)
            .WithMessage("Оценка должна быть от 0 до 5.");

        RuleFor(report => report.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя обязателен.");

        RuleFor(report => report.OrderId)
            .NotEmpty().WithMessage("Идентификатор заказа обязателен.");
    }
}
