using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface ISupportRequestService
    {
        Task<SupportRequestModel> CreateSupportRequestAsync(SupportRequestModel requestData, CancellationToken cancellationToken = default);
    }
}
