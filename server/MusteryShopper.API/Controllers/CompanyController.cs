using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Constants;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;

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
            var id = GetIdFromContext();

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
            var currentCompanyId = GetIdFromContext();

            var updatedCompany = await companyService.UpdateProfileInfoAsync(currentCompanyId, mapper.Map<CompanyToUpdateModel>(companyToUpdate), cancellationToken);

            return mapper.Map<CompanyProfileViewModel>(updatedCompany);
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
