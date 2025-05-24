using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;

namespace MysteryShopper.BLL.Services;

public interface IUserService
{
    Task<User> GetProfileAsync(Guid id, CancellationToken cancellationToken = default);

    Task<User> UpdateProfileInfoAsync(Guid currentUserId, UserToUpdateModel userData, CancellationToken cancellationToken = default);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<User> GetProfileAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetUserWithReviewsAsync(u => u.Id == id, cancellationToken)
            ?? throw new NotFoundException("Пользователь не найден");

        return user;
    }

    public async Task<User> UpdateProfileInfoAsync(Guid currentUserId, UserToUpdateModel userData, CancellationToken cancellationToken = default)
    {
        if (currentUserId != userData.Id)
        {
            throw new ForbiddenException("Вы не можете обновить чужой профиль");
        }

        var user = await userRepository.GetAsync(u => u.Id == userData.Id, disableTracking: false, cancellationToken)
            ?? throw new NotFoundException("Пользователь не найден");

        var userProperties = typeof(User).GetProperties();

        foreach (var modelProperty in typeof(UserToUpdateModel).GetProperties())
        {
            var userProperty = Array.Find(userProperties, p => p.Name == modelProperty.Name);

            if (userProperty is not null && userProperty.CanWrite)
            {
                var value = modelProperty.GetValue(userData);

                if (value is string stringValue && string.IsNullOrWhiteSpace(stringValue))
                {
                    userProperty.SetValue(user, null);
                    continue;
                }

                userProperty.SetValue(user, value);
            }
        }

        await userRepository.UpdateAsync(user, cancellationToken);

        return await GetProfileAsync(user.Id, cancellationToken);
    }
}
