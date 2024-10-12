using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators
{
    public class OrderCreationValidator : AbstractValidator<OrderModel>
    {
        public OrderCreationValidator()
        {
            RuleFor(order => order.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(order => order.Place)
                .NotEmpty().WithMessage("Place is required.")
                .MaximumLength(255).WithMessage("Place cannot exceed 255 characters.");

            RuleFor(order => order.TimeToComplete)
                .GreaterThan(TimeSpan.Zero).When(order => order.TimeToComplete.HasValue).WithMessage("TimeToComplete must be greater than zero.");

            RuleFor(order => order.Price)
                .GreaterThan(0).When(order => order.Price.HasValue).WithMessage("Price must be greater than zero.");

            RuleFor(order => order.Lat)
                .GreaterThan(0).When(order => order.Lat != null).WithMessage("Lat must be a valid number.");
            RuleFor(order => order.Lng)
                .GreaterThan(0).When(order => order.Lng != null).WithMessage("Lng must be a valid number.");

            RuleFor(order => order.CompanyId)
                .NotEmpty().WithMessage("CompanyId is required.");
        }
    }
}
