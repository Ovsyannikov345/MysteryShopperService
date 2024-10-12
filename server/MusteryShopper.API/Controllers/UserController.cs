using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserController(IUserService userService, IMapper mapper) : ControllerBase
    {
        [HttpGet("my")]
        public async Task<UserProfileViewModel> GetOwnProfile(CancellationToken cancellationToken)
        {
            var id = GetIdFromContext();

            var profile = await userService.GetProfileAsync(id, cancellationToken);

            return mapper.Map<UserProfileViewModel>(profile);
        }

        [HttpGet("{id}")]
        public async Task<UserProfileViewModel> GetProfile(Guid id, CancellationToken cancellationToken)
        {
            var profile = await userService.GetProfileAsync(id, cancellationToken);

            return mapper.Map<UserProfileViewModel>(profile);
        }

        [HttpPut("{id}")]
        public async Task<UserProfileViewModel> UpdateProfileInfo(Guid id, UserToUpdateViewModel userToUpdate, CancellationToken cancellationToken)
        {
            var currentUserId = GetIdFromContext();

            var updatedUser = await userService.UpdateProfileInfoAsync(currentUserId, mapper.Map<User>(userToUpdate), cancellationToken);

            return mapper.Map<UserProfileViewModel>(updatedUser);
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
