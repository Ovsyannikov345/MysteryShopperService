using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;

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
            var reviewToCreate = mapper.Map<CompanyReviewModel>(reviewData);

            reviewToCreate.CompanyId = id;
            reviewToCreate.UserId = GetIdFromContext();

            var createdReview = await reviewService.CreateCompanyReviewAsync(GetIdFromContext(), reviewToCreate, cancellationToken);

            return mapper.Map<ReviewViewModel>(createdReview);
        }

        [HttpPost("user/{id}")]
        [Authorize(Roles = "Company")]
        public async Task<ReviewViewModel> CreateUserReview(Guid id, UserReviewToCreateViewModel reviewData, CancellationToken cancellationToken)
        {
            var reviewToCreate = mapper.Map<UserReviewModel>(reviewData);

            reviewToCreate.UserId = id;
            reviewToCreate.CompanyId = GetIdFromContext();

            var createdReview = await reviewService.CreateUserReviewAsync(GetIdFromContext(), reviewToCreate, cancellationToken);

            return mapper.Map<ReviewViewModel>(createdReview);
        }

        private Guid GetIdFromContext()
        {
            if (!Guid.TryParse(HttpContext.User.FindFirst("Id")?.Value, out Guid id))
            {
                throw new BadRequestException("Valid id is not provided");
            }

            return id;
        }
    }
}
