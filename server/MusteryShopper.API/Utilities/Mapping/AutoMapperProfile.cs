using AutoMapper;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.Utilities.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserProfileViewModel>();
            CreateMap<UserToUpdateViewModel, UserToUpdateModel>();

            CreateMap<Company, CompanyProfileViewModel>();
            CreateMap<ContactPerson, ContactPersonViewModel>();
            CreateMap<CompanyToUpdateViewModel, CompanyToUpdateModel>();
            CreateMap<ContactPersonToUpdateViewModel, ContactPersonToUpdateModel>();

            CreateMap<Order, OrderViewModel>();
            CreateMap<OrderModel, OrderViewModel>();

            CreateMap<Company, OrderCompanyViewModel>();
            CreateMap<OrderToCreateViewModel, OrderModel>();

            CreateMap<CompanyReview, OrderCompanyReviewViewModel>();
            CreateMap<UserOrder, UserOrderViewModel>();

            CreateMap<ReportToCreateViewModel, ReportModel>();
            CreateMap<ReportModel, ReportViewModel>();

            CreateMap<ReportCorrectionToCreateViewModel, ReportCorrectionModel>();
            CreateMap<ReportCorrectionModel, ReportCorrectionViewModel>();

            CreateMap<DisputeToCreateViewModel, DisputeModel>();
            CreateMap<DisputeModel, DisputeViewModel>().ReverseMap();
        }
    }
}
