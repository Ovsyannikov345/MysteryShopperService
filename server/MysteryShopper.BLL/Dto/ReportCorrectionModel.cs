namespace MysteryShopper.BLL.Dto;

public class ReportCorrectionModel
{
    public Guid Id { get; set; }

    public required string Description { get; set; }

    public Guid ReportId { get; set; }

    public required ReportModel Report { get; set; }
}
