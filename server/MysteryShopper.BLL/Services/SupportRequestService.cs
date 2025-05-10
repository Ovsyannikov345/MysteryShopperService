using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;

namespace MysteryShopper.BLL.Services;

public interface ISupportRequestService
{
    Task<SupportRequestModel> CreateSupportRequestAsync(SupportRequestModel requestData, CancellationToken cancellationToken = default);
}

public class SupportRequestService(
    ISupportRequestRepository supportRequestRepository,
    IUserRepository userRepository,
    ICompanyRepository companyRepository,
    IMapper mapper) : ISupportRequestService
{
    public async Task<SupportRequestModel> CreateSupportRequestAsync(SupportRequestModel requestData, CancellationToken cancellationToken = default)
    {
        var isUserExists = await userRepository.ExistsAsync(u => u.Id == requestData.UserId, cancellationToken);

        var isCompanyExists = await companyRepository.ExistsAsync(c => c.Id == requestData.CompanyId, cancellationToken);

        if (!isUserExists && !isCompanyExists)
        {
            throw new BadRequestException("Sender of the support request is not found");
        }

        var createdRequest = await supportRequestRepository.AddAsync(mapper.Map<SupportRequest>(requestData), cancellationToken);

        return mapper.Map<SupportRequestModel>(createdRequest);
    }
}
