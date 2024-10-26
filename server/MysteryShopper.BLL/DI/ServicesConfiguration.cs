using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopper.BLL.Utilities.Validators;
using System.Reflection;

namespace MysteryShopper.BLL.DI
{
    public static class ServicesConfiguration
    {
        public static void AddBusinessLogicDependencies(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetAssembly(typeof(AutoMapperProfile)));

            services.AddValidatorsFromAssemblyContaining<UserRegistrationValidator>();

            services.AddScoped<ITokenService, TokenService>()
                    .AddScoped<IAuthService, AuthService>()
                    .AddScoped<IUserService, UserService>()
                    .AddScoped<ICompanyService, CompanyService>()
                    .AddScoped<IOrderService, OrderService>()
                    .AddScoped<IReportService, ReportService>()
                    .AddScoped<IReportCorrectionService, ReportCorrectionService>()
                    .AddScoped<IDisputeService, DisputeService>()
                    .AddScoped<IReviewService, ReviewService>();
        }
    }
}
