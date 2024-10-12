namespace MysteryShopper.API.ViewModels
{
    public class OrderToCreateViewModel
    {
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Place { get; set; } = string.Empty;

        public TimeSpan? TimeToComplete { get; set; }

        public int? Price { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }
    }
}
