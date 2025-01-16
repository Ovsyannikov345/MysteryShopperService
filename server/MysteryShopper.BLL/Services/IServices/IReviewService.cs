using MysteryShopper.BLL.Dto;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IReviewService
    {
        Task<ReviewModel> CreateCompanyReviewAsync(Guid userId, ReviewModel reviewData, CancellationToken cancellationToken = default);

        Task<ReviewModel> CreateUserReviewAsync(Guid companyId, ReviewModel reviewData, CancellationToken cancellationToken = default);
    }
}
