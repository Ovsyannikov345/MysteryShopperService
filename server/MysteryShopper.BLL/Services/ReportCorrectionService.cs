using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Messages;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;

namespace MysteryShopper.BLL.Services;

public interface IReportCorrectionService
{
    Task<ReportCorrectionModel> CreateReportCorrectionAsync(ReportCorrectionModel correctionData, Guid currentCompanyId, CancellationToken cancellationToken = default);
}

public class ReportCorrectionService(
        INotificationService notificationService,
        IReportRepository reportRepository,
        IReportCorrectionRepository reportCorrectionRepository,
        IMapper mapper,
        ReportCorrectionValidator correctionValidator) : IReportCorrectionService
{
    public async Task<ReportCorrectionModel> CreateReportCorrectionAsync(ReportCorrectionModel correctionData, Guid currentCompanyId, CancellationToken cancellationToken = default)
    {
        var validationResult = correctionValidator.Validate(correctionData);

        if (!validationResult.IsValid)
        {
            throw new BadRequestException(validationResult.Errors[0].ErrorMessage);
        }

        var report = await reportRepository.GetReportDetailsAsync(correctionData.ReportId, cancellationToken)
            ?? throw new NotFoundException("Отчет не найден");

        if (report.Order.CompanyId != currentCompanyId)
        {
            throw new ForbiddenException("Вы не можете создать правки на этот отчет");
        }

        if (report.ReportCorrection is not null)
        {
            throw new BadRequestException("Правки на отчет уже существуют");
        }

        var createdCorrection = await reportCorrectionRepository.AddAsync(mapper.Map<ReportCorrection>(correctionData), cancellationToken);

        await notificationService.CreateNotificationAsync(new NotificationModel
        {
            UserId = report.UserId,
            Text = NotificationMessages.NewReportCorrection,
        }, cancellationToken);

        return mapper.Map<ReportCorrectionModel>(createdCorrection);
    }
}
