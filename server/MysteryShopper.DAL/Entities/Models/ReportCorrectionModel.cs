namespace MysteryShopper.DAL.Entities.Models
{
    public class ReportCorrectionModel
    {
        public Guid Id { get; set; }

        public required string Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid CompanyId { get; set; }

        public required Company Company { get; set; }

        public Guid ReportId { get; set; }

        public required Report Report { get; set; }
    }
}
