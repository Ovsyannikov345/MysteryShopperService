using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.Extensions;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController(INotificationService notificationService, IMapper mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<IEnumerable<NotificationViewModel>> GetNotifications(CancellationToken cancellationToken)
        {
            var id = HttpContext.GetIdFromContext();

            var notifications = HttpContext.GetRoleFromContext() == "User"
                ? await notificationService.GetUserNotificationsAsync(id, cancellationToken)
                : await notificationService.GetCompanyNotificationsAsync(id, cancellationToken);

            return mapper.Map<IEnumerable<NotificationModel>, IEnumerable<NotificationViewModel>>(notifications);
        }

        [HttpPut("{notificationId}/read")]
        public async Task ReadNotification(Guid notificationId, CancellationToken cancellationToken)
        {
            var id = HttpContext.GetIdFromContext();

            if (HttpContext.GetRoleFromContext() == "User")
            {
                await notificationService.ReadUserNotificationAsync(notificationId, id, cancellationToken);
            }
            else
            {
                await notificationService.ReadCompanyNotificationAsync(notificationId, id, cancellationToken);
            }
        }
    }
}
