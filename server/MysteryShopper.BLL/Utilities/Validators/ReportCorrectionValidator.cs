using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators
{
    public class ReportCorrectionValidator : AbstractValidator<ReportCorrectionModel>
    {
        public ReportCorrectionValidator()
        {
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.ReportId)
                .NotEmpty().WithMessage("ReportId is required.");
        }
    }
}
