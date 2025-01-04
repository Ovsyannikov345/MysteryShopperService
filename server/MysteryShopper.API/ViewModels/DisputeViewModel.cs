using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels;

public class DisputeViewModel
{
    public Guid Id { get; set; }

    public string? CompanyText { get; set; }

    public string? UserText { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ResolvedAt { get; set; }

    public Guid OrderId { get; set; }

    public required Order Order { get; set; }

    public Guid UserId { get; set; }

    public required User User { get; set; }
}
