using MysteryShopper.API.Utilities.Responses;
using MysteryShopper.BLL.Utilities.Exceptions;
using System.Net;

namespace MysteryShopper.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, Serilog.ILogger logger)
{
    private readonly RequestDelegate _next = next;

    private readonly Serilog.ILogger _logger = logger;

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        _logger.Error(ex, "Exception was caught {@Ex}");

        ExceptionResponse response = ex switch
        {
            BadRequestException => new(HttpStatusCode.BadRequest, ex.Message),
            ForbiddenException => new(HttpStatusCode.Forbidden, ex.Message),
            InternalServerErrorException => new(HttpStatusCode.InternalServerError, ex.Message),
            NotFoundException => new(HttpStatusCode.NotFound, ex.Message),
            UnauthorizedException => new(HttpStatusCode.Unauthorized, ex.Message),
            _ => new(HttpStatusCode.InternalServerError, ex.Message),
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)response.StatusCode;
        await context.Response.WriteAsJsonAsync(response);
    }
}
