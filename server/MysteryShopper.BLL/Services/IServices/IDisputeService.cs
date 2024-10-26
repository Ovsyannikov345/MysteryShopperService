using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Constants;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IDisputeService
    {
        Task<IEnumerable<DisputeModel>> GetUserDisputesAsync(Guid userId, CancellationToken cancellationToken = default);

        Task<IEnumerable<DisputeModel>> GetOrderDisputesAsync(Guid companyId, Guid orderId, CancellationToken cancellationToken = default);

        Task<DisputeModel> CreateDisputeAsync(Roles creatorRole, DisputeModel disputeData, CancellationToken cancellationToken = default);

        Task<DisputeModel> AddUserDisputeTextAsync(Guid disputeId, Guid userId, string text, CancellationToken cancellationToken = default);

        Task<DisputeModel> AddCompanyDisputeTextAsync(Guid disputeId, Guid companyId, string text, CancellationToken cancellationToken = default);
    }
}
