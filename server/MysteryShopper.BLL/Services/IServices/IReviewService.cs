using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IReviewService
    {
        Task<CompanyReviewModel> CreateCompanyReviewAsync(Guid userId, CompanyReviewModel reviewData, CancellationToken cancellationToken = default);

        Task<UserReviewModel> CreateUserReviewAsync(Guid companyId, UserReviewModel reviewData, CancellationToken cancellationToken = default);
    }
}
