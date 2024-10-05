using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Repositories.IRepositories;
using Npgsql;
using ReviewGuru.DAL.Repositories;
using System.Text;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Repositories;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Services;

namespace MysteryShopper.API.Extensions;

public static class ServicesConfiguration
{
    public static void AddDbContext(this IServiceCollection services, IConfiguration configuration) => services.AddDbContext<MysteryShopperDbContext>(options =>
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

        options.UseNpgsql(connectionString, x => x.UseNetTopologySuite());
    });

    // TODO use for LLM requests

    //public static void AddHttpClientWithApiKey(this IServiceCollection services, IConfiguration configuration)
    //{
    //    services.AddHttpClient("ReviewGuruAPIClient")
    //        .ConfigureHttpClient(client =>
    //        {
    //            var apiKey = configuration["APIKey"];

    //            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
    //        });
    //}

    public static void AddAuthenticationBearer(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudiences = configuration.GetSection("Jwt:Audiences").Get<string[]>(),
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:AccessSecretKey"]!))
            };
        });
    }

    public static void AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        string[]? corsOrigins = configuration.GetSection("Cors:Origins").Get<string[]>() ?? throw new InvalidOperationException("Cors origins are not defined");

        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                    builder => builder.WithOrigins(corsOrigins)
                                      .AllowAnyMethod()
                                      .AllowAnyHeader()
                                      .AllowCredentials());
        });
    }

    public static void AddMapper(this IServiceCollection services)
    {
        var mapperConfig = new MapperConfiguration(config =>
        {
            config.AddProfile(new AutoMapperProfile());
        });

        IMapper mapper = mapperConfig.CreateMapper();

        services.AddSingleton(mapper);
    }

    public static void AddBusinessLogicServices(this IServiceCollection services)
    {
        services.AddScoped<ITokenService, TokenService>()
                .AddScoped<IAuthService, AuthService>();
    }

    public static void AddDataAccessRepositories(this IServiceCollection services)
    {
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>))
                .AddScoped<IUserRepository, UserRepository>()
                .AddScoped<ICompanyRepository, CompanyRepository>()
                .AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
    }

    public static void AddValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<UserRegistrationValidator>();
    }
}
