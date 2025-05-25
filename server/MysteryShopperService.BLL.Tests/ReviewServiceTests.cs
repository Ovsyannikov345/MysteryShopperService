using AutoFixture.Xunit2;
using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using Shouldly;
using System.Linq.Expressions;

namespace MysteryShopperService.BLL.Tests;

public class ReviewServiceTests
{
    private readonly CancellationToken cancellationToken = CancellationToken.None;

    private readonly IMapper mapper = new MapperConfiguration(cfg => cfg.AddProfiles([new AutoMapperProfile()])).CreateMapper();

    [Theory, AutoDomainData]
    public async Task CreateCompanyReviewAsync_IdMismatch_Throws(
        ReviewService reviewService,
        ReviewModel review)
    {
        await reviewService.CreateCompanyReviewAsync(Guid.NewGuid(), review, cancellationToken).ShouldThrowAsync<BadRequestException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateCompanyReviewAsync_StatusNotFound_Throws(
        [Frozen] IUserOrderRepository userOrderRepository,
        ReviewService reviewService,
        ReviewModel review)
    {
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns((UserOrder?)null);

        await reviewService.CreateCompanyReviewAsync(review.UserId, review, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateCompanyReviewAsync_OrderNotCompleted_Throws(
        [Frozen] IUserOrderRepository userOrderRepository,
        ReviewService reviewService,
        UserOrder userOrder,
        ReviewModel review)
    {
        userOrder.Status = UserOrderStatus.InProgress;

        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns(userOrder);

        await reviewService.CreateCompanyReviewAsync(review.UserId, review, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateCompanyReviewAsync_ReviewExists_Throws(
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] ICompanyReviewRepository companyReviewRepository,
        ReviewService reviewService,
        UserOrder userOrder,
        ReviewModel review)
    {
        userOrder.Status = UserOrderStatus.Completed;

        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns(userOrder);
        companyReviewRepository.ExistsAsync(Arg.Any<Expression<Func<CompanyReview, bool>>>(), cancellationToken)
            .Returns(true);

        await reviewService.CreateCompanyReviewAsync(review.UserId, review, cancellationToken).ShouldThrowAsync<BadRequestException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateCompanyReviewAsync_ValidFlow_CreatesReview(
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] ICompanyReviewRepository companyReviewRepository,
        ReviewService reviewService,
        UserOrder userOrder,
        ReviewModel review)
    {
        userOrder.Status = UserOrderStatus.Completed;

        var createdReview = mapper.Map<CompanyReview>(review);

        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns(userOrder);
        companyReviewRepository.ExistsAsync(Arg.Any<Expression<Func<CompanyReview, bool>>>(), cancellationToken)
            .Returns(false);
        companyReviewRepository.AddAsync(Arg.Any<CompanyReview>(), cancellationToken)
            .Returns(createdReview);

        var result = await reviewService.CreateCompanyReviewAsync(review.UserId, review, cancellationToken);

        result.ShouldBeEquivalentTo(review);
    }

    [Theory, AutoDomainData]
    public async Task CreateUserReviewAsync_IdMismatch_Throws(
        ReviewService reviewService,
        ReviewModel review)
    {
        await reviewService.CreateUserReviewAsync(Guid.NewGuid(), review, cancellationToken).ShouldThrowAsync<BadRequestException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateUserReviewAsync_OrderNotFound_Throws(
        [Frozen] IOrderRepository orderRepository,
        ReviewService reviewService,
        ReviewModel review)
    {
        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), disableTracking: true, cancellationToken)
            .Returns((Order?)null);

        await reviewService.CreateUserReviewAsync(review.CompanyId, review, cancellationToken).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateUserReviewAsync_CompanyIdMismatch_Throws(
        [Frozen] IOrderRepository orderRepository,
        ReviewService reviewService,
        Order order,
        ReviewModel review)
    {
        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), disableTracking: true, cancellationToken)
            .Returns(order);

        await reviewService.CreateUserReviewAsync(review.CompanyId, review, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateUserReviewAsync_StatusNotFound_Throws(
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IUserOrderRepository userOrderRepository,
        ReviewService reviewService,
        Order order,
        ReviewModel review)
    {
        order.CompanyId = review.CompanyId;

        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), disableTracking: true, cancellationToken)
            .Returns(order);
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns((UserOrder?)null);

        await reviewService.CreateUserReviewAsync(review.CompanyId, review, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateUserReviewAsync_OrderNotCompleted_Throws(
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IUserOrderRepository userOrderRepository,
        ReviewService reviewService,
        Order order,
        UserOrder userOrder,
        ReviewModel review)
    {
        order.CompanyId = review.CompanyId;
        userOrder.Status = UserOrderStatus.InProgress;

        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), disableTracking: true, cancellationToken)
            .Returns(order);
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns(userOrder);

        await reviewService.CreateUserReviewAsync(review.CompanyId, review, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateUserReviewAsync_ReviewExists_Throws(
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] IUserReviewRepository userReviewRepository,
        ReviewService reviewService,
        Order order,
        UserOrder userOrder,
        ReviewModel review)
    {
        order.CompanyId = review.CompanyId;
        userOrder.Status = UserOrderStatus.Completed;

        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), disableTracking: true, cancellationToken)
            .Returns(order);
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns(userOrder);
        userReviewRepository.ExistsAsync(Arg.Any<Expression<Func<UserReview, bool>>>(), cancellationToken)
            .Returns(true);

        await reviewService.CreateUserReviewAsync(review.CompanyId, review, cancellationToken).ShouldThrowAsync<BadRequestException>();
    }

    [Theory, AutoDomainData]
    public async Task CreateUserReviewAsync_ValidFlow_CreatesReview(
        [Frozen] IOrderRepository orderRepository,
        [Frozen] IUserOrderRepository userOrderRepository,
        [Frozen] IUserReviewRepository userReviewRepository,
        ReviewService reviewService,
        Order order,
        UserOrder userOrder,
        ReviewModel review)
    {
        order.CompanyId = review.CompanyId;
        userOrder.Status = UserOrderStatus.Completed;

        var createdReview = mapper.Map<UserReview>(review);

        orderRepository.GetAsync(Arg.Any<Expression<Func<Order, bool>>>(), disableTracking: true, cancellationToken)
            .Returns(order);
        userOrderRepository.GetUserOrderAsync(Arg.Any<Guid>(), Arg.Any<Guid>(), cancellationToken)
            .Returns(userOrder);
        userReviewRepository.ExistsAsync(Arg.Any<Expression<Func<UserReview, bool>>>(), cancellationToken)
            .Returns(false);
        userReviewRepository.AddAsync(Arg.Any<UserReview>(), cancellationToken)
            .Returns(createdReview);

        var result = await reviewService.CreateUserReviewAsync(review.CompanyId, review, cancellationToken);

        result.ShouldBeEquivalentTo(review);
    }
}
