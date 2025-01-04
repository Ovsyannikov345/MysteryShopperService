using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.API.ViewModels;

public class ReportCorrectionViewModel
{
    public Guid Id { get; set; }

    public required string Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid CompanyId { get; set; }

    public required Company Company { get; set; }

    public Guid ReportId { get; set; }

    public required Report Report { get; set; }
}
