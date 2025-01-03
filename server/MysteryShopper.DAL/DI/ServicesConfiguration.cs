﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Repositories;
using MysteryShopper.DAL.Repositories.IRepositories;
using Npgsql;

namespace MysteryShopper.DAL.DI
{
    public static class ServicesConfiguration
    {
        public static void AddDataAccessDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext(configuration);

            services.AddScoped<IUserRepository, UserRepository>()
                    .AddScoped<ICompanyRepository, CompanyRepository>()
                    .AddScoped<IRefreshTokenRepository, RefreshTokenRepository>()
                    .AddScoped<IOrderRepository, OrderRepository>()
                    .AddScoped<IUserOrderRepository, UserOrderRepository>()
                    .AddScoped<IReportRepository, ReportRepository>()
                    .AddScoped<IReportCorrectionRepository, ReportCorrectionRepository>()
                    .AddScoped<IDisputeRepository, DisputeRepository>()
                    .AddScoped<ICompanyReviewRepository, CompanyReviewRepository>()
                    .AddScoped<IUserReviewRepository, UserReviewRepository>()
                    .AddScoped<ISupportRequestRepository, SupportRequestRepository>()
                    .AddScoped<INotificationRepository, NotificationRepository>()
                    .AddScoped<ICategoryRepository, CategoryRepository>()
                    .AddScoped<IOrderTagRepository, OrderTagRepository>();
        }

        private static void AddDbContext(this IServiceCollection services, IConfiguration configuration) =>
            services.AddDbContext<MysteryShopperDbContext>(options =>
            {
                var databaseUri = new Uri(configuration["DATABASE_URL"]!);

                var userInfo = databaseUri.UserInfo.Split(':');

                var connectionString = new NpgsqlConnectionStringBuilder
                {
                    Host = databaseUri.Host,
                    Port = databaseUri.Port,
                    Username = userInfo[0],
                    Password = userInfo[1],
                    Database = databaseUri.LocalPath.TrimStart('/'),
                    SslMode = SslMode.Disable,
                }.ToString();

                options.UseNpgsql(connectionString);
            });
    }
}
