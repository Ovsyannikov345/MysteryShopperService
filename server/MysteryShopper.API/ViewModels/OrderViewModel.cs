namespace MysteryShopper.API.ViewModels
{
    public class OrderViewModel
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Place { get; set; } = string.Empty;

        public TimeSpan? TimeToComplete { get; set; }

        public int? Price { get; set; }

        public DateTime CreatedAt { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }

        public bool IsClosed { get; set; }

        public OrderCompanyViewModel Company { get; set; } = null!;
    }
}
