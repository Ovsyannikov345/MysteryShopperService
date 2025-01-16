using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.Services
{
    public class ReviewService(
        ICompanyReviewRepository companyReviewRepository,
        IUserReviewRepository userReviewRepository,
        IUserOrderRepository userOrderRepository,
        IOrderRepository orderRepository,
        IMapper mapper) : IReviewService
    {
        public async Task<ReviewModel> CreateCompanyReviewAsync(Guid userId, ReviewModel reviewData, CancellationToken cancellationToken = default)
        {
            if (userId != reviewData.UserId)
            {
                throw new BadRequestException("You can't post a review from other person");
            }

            var userOrder = await userOrderRepository.GetUserOrderAsync(userId, reviewData.OrderId, cancellationToken);

            if (userOrder is null || userOrder.Status != UserOrderStatus.Completed)
            {
                throw new ForbiddenException("You can't post a review to this order");
            }

            if (await companyReviewRepository.ExistsAsync(r => r.OrderId == reviewData.OrderId && r.UserId == reviewData.UserId, cancellationToken))
            {
                throw new BadRequestException("Review already exists");
            }

            var createdReview = await companyReviewRepository.AddAsync(mapper.Map<CompanyReview>(reviewData), cancellationToken);

            return mapper.Map<ReviewModel>(createdReview);
        }

        public async Task<ReviewModel> CreateUserReviewAsync(Guid companyId, ReviewModel reviewData, CancellationToken cancellationToken = default)
        {
            if (companyId != reviewData.CompanyId)
            {
                throw new BadRequestException("You can't post a review from other company");
            }

            var order = await orderRepository.GetByItemAsync(o => o.Id == reviewData.OrderId, cancellationToken)
                ?? throw new NotFoundException("Order is not found");

            if (order.CompanyId != companyId)
            {
                throw new ForbiddenException("You can't post a review from other company");
            }

            var userOrder = await userOrderRepository.GetUserOrderAsync(reviewData.UserId, reviewData.OrderId, cancellationToken);

            if (userOrder is null || userOrder.Status != UserOrderStatus.Completed)
            {
                throw new ForbiddenException("You can't post a review to this user");
            }

            if (await userReviewRepository.ExistsAsync(r => r.OrderId == reviewData.OrderId && r.UserId == reviewData.UserId, cancellationToken))
            {
                throw new BadRequestException("Review already exists");
            }

            var createdReview = await userReviewRepository.AddAsync(mapper.Map<UserReview>(reviewData), cancellationToken);

            return mapper.Map<ReviewModel>(createdReview);
        }
    }
}
