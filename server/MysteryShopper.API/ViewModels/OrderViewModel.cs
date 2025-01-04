namespace MysteryShopper.API.ViewModels;

public class OrderViewModel
{
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public required string Place { get; set; }

    public TimeSpan? TimeToComplete { get; set; }

    public int? Price { get; set; }

    public DateTime CreatedAt { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }

    public bool IsClosed { get; set; }

    public required OrderCompanyViewModel Company { get; set; }
}
