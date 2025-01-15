using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.ImageServices.IImageServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages.IBlobStorages;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.ImageServices;

public class UserImageService(IUserAvatarStorage userAvatarStorage, IUserRepository userRepository) : ImageService(userAvatarStorage), IUserImageService
{
    public override async Task UploadImageAsync(Guid entityId, IFormFile file, CancellationToken cancellationToken = default)
    {
        _ = await userRepository.GetByItemAsync(u => u.Id == entityId, cancellationToken)
            ?? throw new NotFoundException("User is not found");

        await base.UploadImageAsync(entityId, file, cancellationToken);
    }
}
