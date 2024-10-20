using FluentValidation;
using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Utilities.Validators
{
    public class ReportValidator : AbstractValidator<ReportModel>
    {
        public ReportValidator()
        {
            RuleFor(report => report.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(report => report.Description)
                .NotEmpty().WithMessage("Description is required.");

            RuleFor(report => report.Grade)
                .InclusiveBetween((short)0, (short)5).WithMessage("Grade must be between 0 and 5.");

            RuleFor(report => report.UserId)
                .NotEmpty().WithMessage("UserId is required.");

            RuleFor(report => report.OrderId)
                .NotEmpty().WithMessage("OrderId is required.");
        }
    }
}
