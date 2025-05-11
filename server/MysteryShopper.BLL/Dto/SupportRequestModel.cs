using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Dto;

public class SupportRequestModel
{
    public Guid Id { get; set; }

    public required string Text { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? UserId { get; set; }

    public Guid? CompanyId { get; set; }

    public Company? Company { get; set; }

    public User? User { get; set; }
}
