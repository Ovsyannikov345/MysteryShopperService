using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Messages;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;

namespace MysteryShopper.BLL.Services
{
    public class ReportService(
        INotificationService notificationService,
        IReportRepository reportRepository,
        IUserOrderRepository userOrderRepository,
        IMapper mapper,
        ReportValidator reportValidator) : IReportService
    {
        public async Task<ReportModel> CreateReportAsync(ReportModel reportData, CancellationToken cancellationToken = default)
        {
            var validationResult = reportValidator.Validate(reportData);

            if (!validationResult.IsValid)
            {
                throw new BadRequestException(validationResult.Errors[0].ErrorMessage);
            }

            var userOrder = await userOrderRepository.GetUserOrderAsync(reportData.UserId, reportData.OrderId, cancellationToken);

            if (userOrder is null || userOrder.Status != UserOrderStatus.InProgress)
            {
                throw new ForbiddenException("You are not allowed to send reports to this order");
            }

            var createdReport = await reportRepository.AddAsync(mapper.Map<Report>(reportData), cancellationToken);

            await notificationService.CreateNotificationAsync(new NotificationModel
            {
                CompanyId = userOrder.Order.CompanyId,
                Text = NotificationMessages.NewReport,
            }, cancellationToken);

            return mapper.Map<ReportModel>(createdReport);
        }
    }
}
