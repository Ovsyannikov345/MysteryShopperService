using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MysteryShopper.BLL.FileServices;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopper.BLL.Utilities.Mistral.Services;
using MysteryShopper.BLL.Utilities.Mistral.Services.IServices;
using MysteryShopper.BLL.Utilities.Validators;
using System.Reflection;

namespace MysteryShopper.BLL.DI
{
    public static class ServicesConfiguration
    {
        public static void AddBusinessLogicDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpClient("MistralAPIClient")
            .ConfigureHttpClient(client =>
            {
                var apiKey = configuration["MistralAPI:Key"];

                var apiUri = new Uri(configuration["MistralAPI:Uri"]!);

                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
                client.BaseAddress = apiUri;
            });

            services.AddAutoMapper(Assembly.GetAssembly(typeof(AutoMapperProfile)));

            services.AddValidatorsFromAssemblyContaining<UserRegistrationValidator>();

            services.AddScoped<ITokenService, TokenService>()
                    .AddScoped<IAuthService, AuthService>()
                    .AddScoped<IUserService, UserService>()
                    .AddScoped<ICompanyService, CompanyService>()
                    .AddScoped<IOrderService, OrderService>()
                    .AddScoped<IReportService, ReportService>()
                    .AddScoped<IReportCorrectionService, ReportCorrectionService>()
                    .AddScoped<IReviewService, ReviewService>()
                    .AddScoped<INotificationService, NotificationService>()
                    .AddScoped<IMistralService, MistralService>();

            services.AddScoped<ICompanyImageService, CompanyImageService>()
                    .AddScoped<IUserImageService, UserImageService>()
                    .AddScoped<IReportAttachmentService, ReportAttachmentService>();
        }
    }
}
