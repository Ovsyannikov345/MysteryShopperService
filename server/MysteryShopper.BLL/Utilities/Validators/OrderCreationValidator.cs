using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class OrderCreationValidator : AbstractValidator<OrderModel>
{
    public OrderCreationValidator()
    {
        RuleFor(order => order.Title)
            .NotEmpty().WithMessage("Заголовок обязателен.")
            .MaximumLength(100).WithMessage("Заголовок не должен превышать 100 символов.");

        RuleFor(order => order.Description)
            .NotEmpty().WithMessage("Описание обязательно.");

        RuleFor(order => order.Place)
            .MaximumLength(255).WithMessage("Адрес не должен превышать 255 символов.");

        RuleFor(order => order.TimeToComplete)
            .GreaterThan(TimeSpan.Zero).When(order => order.TimeToComplete.HasValue)
            .WithMessage("Время выполнения должно быть больше нуля.");

        RuleFor(order => order.Price)
            .GreaterThan(0).When(order => order.Price.HasValue)
            .WithMessage("Цена должна быть больше нуля.");

        RuleFor(order => order.Lat)
            .GreaterThan(0).When(order => order.Lat != null)
            .WithMessage("Широта должна быть допустимым числом.");

        RuleFor(order => order.Lng)
            .GreaterThan(0).When(order => order.Lng != null)
            .WithMessage("Долгота должна быть допустимым числом.");

        RuleFor(order => order.CompanyId)
            .NotEmpty().WithMessage("Идентификатор компании обязателен.");
    }
}
