using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;

namespace MysteryShopper.BLL.Services;

public interface IReviewService
{
    Task<ReviewModel> CreateCompanyReviewAsync(Guid userId, ReviewModel reviewData, CancellationToken cancellationToken = default);

    Task<ReviewModel> CreateUserReviewAsync(Guid companyId, ReviewModel reviewData, CancellationToken cancellationToken = default);
}

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
            throw new BadRequestException("Вы не можете отправить отзыв от лица другого человека");
        }

        var userOrder = await userOrderRepository.GetUserOrderAsync(userId, reviewData.OrderId, cancellationToken);

        if (userOrder is null || userOrder.Status != UserOrderStatus.Completed)
        {
            throw new ForbiddenException("Вы не можете отправить отзыв на этот заказ");
        }

        if (await companyReviewRepository.ExistsAsync(r => r.OrderId == reviewData.OrderId && r.UserId == reviewData.UserId, cancellationToken))
        {
            throw new BadRequestException("Отзыв уже существует");
        }

        var createdReview = await companyReviewRepository.AddAsync(mapper.Map<CompanyReview>(reviewData), cancellationToken);

        return mapper.Map<ReviewModel>(createdReview);
    }

    public async Task<ReviewModel> CreateUserReviewAsync(Guid companyId, ReviewModel reviewData, CancellationToken cancellationToken = default)
    {
        if (companyId != reviewData.CompanyId)
        {
            throw new BadRequestException("Вы не можете отправить отзыв от лица другой компании");
        }

        var order = await orderRepository.GetAsync(o => o.Id == reviewData.OrderId, disableTracking: true, cancellationToken)
            ?? throw new NotFoundException("Заказ не найден");

        if (order.CompanyId != companyId)
        {
            throw new ForbiddenException("Вы не можете отправить отзыв на этот заказ");
        }

        var userOrder = await userOrderRepository.GetUserOrderAsync(reviewData.UserId, reviewData.OrderId, cancellationToken);

        if (userOrder is null || userOrder.Status != UserOrderStatus.Completed)
        {
            throw new ForbiddenException("Вы не можете отправить отзыв на этот заказ");
        }

        if (await userReviewRepository.ExistsAsync(r => r.OrderId == reviewData.OrderId && r.UserId == reviewData.UserId, cancellationToken))
        {
            throw new BadRequestException("Отзыв уже существует");
        }

        var createdReview = await userReviewRepository.AddAsync(mapper.Map<UserReview>(reviewData), cancellationToken);

        return mapper.Map<ReviewModel>(createdReview);
    }
}
