using Microsoft.AspNetCore.Http;
using MysteryShopper.BLL.ImageServices.IImageServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.BlobStorages.IBlobStorages;
using MysteryShopper.DAL.Repositories.IRepositories;

namespace MysteryShopper.BLL.ImageServices;

public class CompanyImageService(ICompanyAvatarStorage companyAvatarStorage, ICompanyRepository companyRepository)
    : ImageService(companyAvatarStorage), ICompanyImageService
{
    public override async Task UploadImageAsync(Guid entityId, IFormFile file, CancellationToken cancellationToken = default)
    {
        _ = await companyRepository.GetByItemAsync(c => c.Id == entityId, cancellationToken)
            ?? throw new NotFoundException("Company is not found");

        await base.UploadImageAsync(entityId, file, cancellationToken);
    }
}
