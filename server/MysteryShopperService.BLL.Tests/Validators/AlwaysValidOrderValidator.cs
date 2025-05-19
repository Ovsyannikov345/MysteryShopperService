using FluentValidation;
using FluentValidation.Results;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Validators;

namespace MysteryShopperService.BLL.Tests.Validators;

class AlwaysValidOrderValidator : OrderCreationValidator
{
    public override ValidationResult Validate(ValidationContext<OrderModel> context)
    {
        return new ValidationResult();
    }
}
