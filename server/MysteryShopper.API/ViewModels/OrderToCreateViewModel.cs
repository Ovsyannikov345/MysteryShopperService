namespace MysteryShopper.API.ViewModels;

public class OrderToCreateViewModel
{
    public required string Title { get; set; }

    public required string Description { get; set; }

    public required string Place { get; set; }

    public TimeSpan? TimeToComplete { get; set; }

    public int? Price { get; set; }

    public double? Lat { get; set; }

    public double? Lng { get; set; }
}
