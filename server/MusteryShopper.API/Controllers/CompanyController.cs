using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class CompanyController(ICompanyService companyService, IMapper mapper) : ControllerBase
    {
        [HttpGet("my")]
        [Authorize(Roles = "Company")]
        public async Task<CompanyProfileViewModel> GetOwnProfile(CancellationToken cancellationToken)
        {
            var id = HttpContext.GetIdFromContext();

            var profile = await companyService.GetProfileAsync(id, cancellationToken);

            return mapper.Map<CompanyProfileViewModel>(profile);
        }

        [HttpGet("{id}")]
        public async Task<CompanyProfileViewModel> GetProfile(Guid id, CancellationToken cancellationToken)
        {
            var profile = await companyService.GetProfileAsync(id, cancellationToken);

            return mapper.Map<CompanyProfileViewModel>(profile);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Company")]
        public async Task<CompanyProfileViewModel> UpdateProfileInfo(Guid id, CompanyToUpdateViewModel companyToUpdate, CancellationToken cancellationToken)
        {
            var currentCompanyId = HttpContext.GetIdFromContext();

            var updatedCompany = await companyService.UpdateProfileInfoAsync(currentCompanyId, mapper.Map<CompanyToUpdateModel>(companyToUpdate), cancellationToken);

            return mapper.Map<CompanyProfileViewModel>(updatedCompany);
        }
    }
}
