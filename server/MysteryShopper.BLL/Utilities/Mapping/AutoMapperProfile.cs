using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Utilities.Pagination;

namespace MysteryShopper.BLL.Utilities.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserRegistrationCredentials, User>();
            CreateMap<CompanyRegistrationCredentials, Company>()
                .ForMember(dest => dest.ContactPerson, opt => opt.MapFrom(src => src.CompanyContactPerson));
            CreateMap<CompanyContactPersonCredentials, ContactPerson>();
            CreateMap<ContactPersonToUpdateModel, ContactPerson>();

            CreateMap<OrderModel, Order>().ReverseMap();
            CreateMap<ReportModel, Report>().ReverseMap();
            CreateMap<ReportCorrectionModel, ReportCorrection>().ReverseMap();

            CreateMap<Dispute, DisputeModel>().ReverseMap();

            CreateMap<CompanyReview, CompanyReviewModel>().ReverseMap();
            CreateMap<UserReview, UserReviewModel>().ReverseMap();

            CreateMap<NotificationModel, Notification>().ReverseMap();

            CreateMap(typeof(PagedResult<>), typeof(PagedResult<>))
                .ForMember(nameof(PagedResult<object>.PageContent), opt => opt.MapFrom(nameof(PagedResult<object>.PageContent)));
        }
    }
}
