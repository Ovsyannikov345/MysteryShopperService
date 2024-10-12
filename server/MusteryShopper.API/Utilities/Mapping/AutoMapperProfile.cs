using AutoMapper;
using MysteryShopper.API.ViewModels;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.Utilities.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserProfileViewModel>();
            CreateMap<UserToUpdateViewModel, User>();

            CreateMap<Company, CompanyProfileViewModel>();
            CreateMap<ContactPerson, ContactPersonViewModel>();
            CreateMap<CompanyToUpdateViewModel, Company>();
            CreateMap<ContactPersonToUpdateViewModel, ContactPerson>();
        }
    }
}
