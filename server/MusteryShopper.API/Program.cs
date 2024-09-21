using Microsoft.EntityFrameworkCore;
using MysteryShopper.API.Extensions;
using MysteryShopper.DAL.Data;

namespace MysteryShopper.API;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.AddLogging();

        // Configure services.
        var services = builder.Services;

        services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddBusinessLogicServices();
        services.AddIdentityDbContext(builder.Configuration);
        services.AddDataAccessRepositories();

        services.AddAuthenticationBearer(builder.Configuration);
        services.AddAuthorization();
        services.AddCorsPolicy(builder.Configuration);

        services.AddMapper();
        services.AddAutoValidation();

        var app = builder.Build();

        // Ensure database is up to date.
        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<MysteryShopperDbContext>();
            context.Database.Migrate();
        }

        // Configure the HTTP request pipeline.
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors("CorsPolicy");
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();


        app.MapControllers()
           .RequireAuthorization();

        app.Run();
    }
}
