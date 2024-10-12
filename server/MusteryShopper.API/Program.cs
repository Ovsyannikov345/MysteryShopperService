using Microsoft.EntityFrameworkCore;
using MysteryShopper.API.DI;
using MysteryShopper.API.Middleware;
using MysteryShopper.API.Utilities.Mapping;
using MysteryShopper.BLL.DI;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.DI;
using Serilog;
using System.Reflection;

namespace MysteryShopper.API;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Host.UseSerilog((ctx, lc) => lc.WriteTo.Console()
                                               .WriteTo.File("../debug_log.txt"));

        // Configure services.
        var services = builder.Services;

        var configuration = builder.Configuration;

        services.AddDataAccessDependencies(configuration);
        services.AddBusinessLogicDependencies();

        services.AddAutoMapper(Assembly.GetAssembly(typeof(AutoMapperProfile)));
        services.AddAuthenticationBearer(builder.Configuration);
        services.AddCorsPolicy(builder.Configuration);

        services.AddAuthorization();

        services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

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


        app.MapControllers();

        app.Run();
    }
}
