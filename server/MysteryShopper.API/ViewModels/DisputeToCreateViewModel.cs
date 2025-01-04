namespace MysteryShopper.API.ViewModels;

public class DisputeToCreateViewModel
{
    public string? CompanyText { get; set; }

    public string? UserText { get; set; }

    public required Guid OrderId { get; set; }

    public required Guid UserId { get; set; }
}
