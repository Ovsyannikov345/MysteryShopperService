using FluentValidation;
using FluentValidation.Results;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Validators;

namespace MysteryShopperService.BLL.Tests.Validators;

class AlwaysValidReportValidator : ReportValidator
{
    public override ValidationResult Validate(ValidationContext<ReportModel> context)
    {
        return new ValidationResult();
    }
}
