using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;

namespace MysteryShopper.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UserController(IUserService userService, IMapper mapper) : ControllerBase
{
    [HttpGet("my")]
    [Authorize(Roles = "User")]
    public async Task<UserProfileViewModel> GetOwnProfileAsync(CancellationToken cancellationToken)
    {
        var id = HttpContext.GetIdFromContext();

        var profile = await userService.GetProfileAsync(id, cancellationToken);

        return mapper.Map<UserProfileViewModel>(profile);
    }

    [HttpGet("{id}")]
    public async Task<UserProfileViewModel> GetProfilesync(Guid id, CancellationToken cancellationToken)
    {
        var profile = await userService.GetProfileAsync(id, cancellationToken);

        return mapper.Map<UserProfileViewModel>(profile);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "User")]
    public async Task<UserProfileViewModel> UpdateProfileInfosync(Guid id, UserToUpdateViewModel userToUpdate, CancellationToken cancellationToken)
    {
        var currentUserId = HttpContext.GetIdFromContext();

        if (id != userToUpdate.Id)
        {
            throw new BadRequestException("User id in route doesn't match with provided in body");
        }

        var updatedUser = await userService.UpdateProfileInfoAsync(currentUserId, mapper.Map<UserToUpdateModel>(userToUpdate), cancellationToken);

        return mapper.Map<UserProfileViewModel>(updatedUser);
    }
}
