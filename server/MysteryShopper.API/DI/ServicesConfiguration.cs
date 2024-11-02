using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace MysteryShopper.API.DI;

public static class ServicesConfiguration
{
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
                //NameClaimType = ClaimTypes.NameIdentifier,
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
}
