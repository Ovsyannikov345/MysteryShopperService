using Serilog;

namespace MysteryShopper.API.Extensions;

public static class BuilderConfiguration
{
    public static void AddLogging(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((ctx, lc) => lc.WriteTo.Console()
                                               .WriteTo.File("../debug_log.txt"));
    }
}
