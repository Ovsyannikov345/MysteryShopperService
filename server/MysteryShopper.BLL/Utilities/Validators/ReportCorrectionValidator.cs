using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators;

public class ReportCorrectionValidator : AbstractValidator<ReportCorrectionModel>
{
    public ReportCorrectionValidator()
    {
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Описание обязательно для заполнения.")
            .MaximumLength(500).WithMessage("Описание не должно превышать 500 символов.");

        RuleFor(x => x.ReportId)
            .NotEmpty().WithMessage("Идентификатор отчёта обязателен.");
    }
}
