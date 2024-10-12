using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<User> GetProfileAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetUserWithReviewsAsync(u => u.Id == id, cancellationToken) ?? throw new NotFoundException("User is not found");

        return user;
    }

    public async Task<User> UpdateProfileInfoAsync(Guid currentUserId, User user, CancellationToken cancellationToken = default)
    {
        if (currentUserId != user.Id)
        {
            throw new ForbiddenException("You can't update other person's profile");
        }

        if (await userRepository.GetByItemAsync(u => u.Id == user.Id, cancellationToken) == null)
        {
            throw new NotFoundException("User is not found");
        }

        return await userRepository.UpdateAsync(user, cancellationToken);
    }
}

