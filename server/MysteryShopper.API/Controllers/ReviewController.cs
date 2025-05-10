using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReviewController(IReviewService reviewService, IMapper mapper) : ControllerBase
    {
        [HttpPost("company/{id}")]
        [Authorize(Roles = "User")]
        public async Task<ReviewViewModel> CreateCompanyReview(Guid id, CompanyReviewToCreateViewModel reviewData, CancellationToken cancellationToken)
        {
            var reviewToCreate = mapper.Map<ReviewModel>(reviewData);

            reviewToCreate.CompanyId = id;
            reviewToCreate.UserId = HttpContext.GetIdFromContext();

            var createdReview = await reviewService.CreateCompanyReviewAsync(HttpContext.GetIdFromContext(), reviewToCreate, cancellationToken);

            return mapper.Map<ReviewViewModel>(createdReview);
        }

        [HttpPost("user/{id}")]
        [Authorize(Roles = "Company")]
        public async Task<ReviewViewModel> CreateUserReview(Guid id, UserReviewToCreateViewModel reviewData, CancellationToken cancellationToken)
        {
            var reviewToCreate = mapper.Map<ReviewModel>(reviewData);

            reviewToCreate.UserId = id;
            reviewToCreate.CompanyId = HttpContext.GetIdFromContext();

            var createdReview = await reviewService.CreateUserReviewAsync(HttpContext.GetIdFromContext(), reviewToCreate, cancellationToken);

            return mapper.Map<ReviewViewModel>(createdReview);
        }
    }
}
