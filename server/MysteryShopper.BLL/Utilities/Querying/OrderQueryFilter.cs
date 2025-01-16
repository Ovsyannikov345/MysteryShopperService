namespace MysteryShopper.BLL.Utilities.Querying;

public record OrderQueryFilter(
    string? Text,
    TimeSpan? MinTimeToComplete,
    TimeSpan? MaxTimeToComplete,
    int? MinPrice,
    int? MaxPrice);
