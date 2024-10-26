using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Constants;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Messages;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.Services
{
    public class DisputeService(
        INotificationService notificationService,
        IOrderRepository orderRepository,
        IUserOrderRepository userOrderRepository,
        IDisputeRepository disputeRepository,
        IMapper mapper) : IDisputeService
    {
        public async Task<DisputeModel> AddCompanyDisputeTextAsync(Guid disputeId, Guid companyId, string text, CancellationToken cancellationToken = default)
        {
            var dispute = await disputeRepository.GetDisputeWithOrderAsync(d => d.Id == disputeId, cancellationToken)
                ?? throw new NotFoundException("Dispute is not found");

            if (dispute.Order.CompanyId != companyId)
            {
                throw new ForbiddenException("You can't access this dispute");
            }

            dispute.CompanyText = text;

            var updatedDispute = await disputeRepository.UpdateAsync(dispute, cancellationToken);

            return mapper.Map<DisputeModel>(updatedDispute);
        }

        public async Task<DisputeModel> AddUserDisputeTextAsync(Guid disputeId, Guid userId, string text, CancellationToken cancellationToken = default)
        {
            var dispute = await disputeRepository.GetDisputeWithOrderAsync(d => d.Id == disputeId, cancellationToken)
                ?? throw new NotFoundException("Dispute is not found");

            if (dispute.UserId != userId)
            {
                throw new ForbiddenException("You can't access this dispute");
            }

            dispute.UserText = text;

            var updatedDispute = await disputeRepository.UpdateAsync(dispute, cancellationToken);

            return mapper.Map<DisputeModel>(updatedDispute);
        }

        public async Task<DisputeModel> CreateDisputeAsync(Roles creatorRole, DisputeModel disputeData, CancellationToken cancellationToken = default)
        {
            var order = await orderRepository.GetFullOrderDetailsAsync(disputeData.OrderId, cancellationToken)
                ?? throw new NotFoundException("Order is not found");

            if (await disputeRepository.ExistsAsync(d => d.Id == disputeData.Id, cancellationToken))
            {
                throw new BadRequestException("Dispute already exists");
            }

            var userOrder = await userOrderRepository.GetUserOrderAsync(disputeData.UserId, disputeData.OrderId, cancellationToken);

            if (userOrder is null || userOrder.Status != UserOrderStatus.InProgress)
            {
                throw new BadRequestException("User is not working on this order");
            }

            var createdDispute = await disputeRepository.AddAsync(mapper.Map<Dispute>(disputeData), cancellationToken);

            await notificationService.CreateNotificationAsync(new NotificationModel
            {
                UserId = creatorRole == Roles.Company ? createdDispute.UserId : null,
                CompanyId = creatorRole == Roles.User ? order.CompanyId : null,
                Text = NotificationMessages.NewDespute,
            }, cancellationToken);

            return mapper.Map<DisputeModel>(createdDispute);
        }

        public async Task<IEnumerable<DisputeModel>> GetOrderDisputesAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default)
        {
            var order = await orderRepository.GetByItemAsync(o => o.Id == orderId, cancellationToken);

            if (order is not null && order.CompanyId != companyId)
            {
                throw new ForbiddenException("You can't access theese disputes");
            }

            var disputes = await disputeRepository.GetDisputesAsync(d => d.OrderId == orderId, cancellationToken);

            return mapper.Map<IEnumerable<Dispute>, IEnumerable<DisputeModel>>(disputes);
        }

        public async Task<IEnumerable<DisputeModel>> GetUserDisputesAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var disputes = await disputeRepository.GetDisputesAsync(d => d.UserId == userId, cancellationToken);

            return mapper.Map<IEnumerable<Dispute>, IEnumerable<DisputeModel>>(disputes);
        }
    }
}
