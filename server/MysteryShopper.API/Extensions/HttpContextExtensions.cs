using MysteryShopper.BLL.Utilities.Exceptions;
using System.Security.Claims;

namespace MysteryShopper.API.Extensions
{
    public static class HttpContextExtensions
    {
        public static Guid GetIdFromContext(this HttpContext httpContext)
        {
            if (!Guid.TryParse(httpContext.User.FindFirst("Id")?.Value, out Guid id))
            {
                throw new BadRequestException("Valid id is not provided in http context");
            }

            return id;
        }

        public static string GetRoleFromContext(this HttpContext httpContext)
        {
            var role = httpContext.User.FindFirstValue(ClaimTypes.Role)
                ?? throw new ForbiddenException("Role is not provided in http context");

            return role;
        }
    }
}
