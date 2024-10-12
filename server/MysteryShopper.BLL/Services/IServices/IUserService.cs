using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices
{
    public interface IUserService
    {
        Task<User> GetProfileAsync(Guid id, CancellationToken cancellationToken = default);

        public Task<User> UpdateProfileInfoAsync(Guid currentUserId, User user, CancellationToken cancellationToken = default);
    }
}