using MysteryShopper.BLL.Dto;
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

    public async Task<User> UpdateProfileInfoAsync(Guid currentUserId, UserToUpdateModel userData, CancellationToken cancellationToken = default)
    {
        if (currentUserId != userData.Id)
        {
            throw new ForbiddenException("You can't update other person's profile");
        }

        var user = await userRepository.GetByItemAsync(u => u.Id == userData.Id, cancellationToken) ?? throw new NotFoundException("User is not found");

        var userProperties = typeof(User).GetProperties();

        foreach (var modelProperty in typeof(UserToUpdateModel).GetProperties())
        {
            var userProperty = Array.Find(userProperties, p => p.Name == modelProperty.Name);

            if (userProperty != null && userProperty.CanWrite)
            {
                var value = modelProperty.GetValue(userData);

                userProperty.SetValue(user, value);
            }
        }

        return await userRepository.UpdateAsync(user, cancellationToken);
    }
}

