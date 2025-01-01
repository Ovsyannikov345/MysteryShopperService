namespace MysteryShopper.DAL.Entities.Models
{
    public class ReportCorrectionModel : EntityBase
    {
        public required string Description { get; set; }

        public Guid CompanyId { get; set; }

        public required Company Company { get; set; }

        public Guid ReportId { get; set; }

        public required Report Report { get; set; }
    }
}
