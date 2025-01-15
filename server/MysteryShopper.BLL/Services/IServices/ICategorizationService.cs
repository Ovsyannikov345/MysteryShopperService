using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Services.IServices;

public interface ICategorizationService
{
    Task CategorizeOrder(Order order, CancellationToken cancellationToken = default);
}
