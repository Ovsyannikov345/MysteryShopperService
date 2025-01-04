using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class ContactPerson : EntityBase
{
    [MaxLength(50)]
    public required string Name { get; set; }

    [MaxLength(50)]
    public required string Surname { get; set; }

    [MaxLength(50)]
    public string? Patronymic { get; set; }

    [MaxLength(50)]
    public required string Phone { get; set; }

    [MaxLength(255)]
    public required string Email { get; set; }

    public Guid CompanyId { get; set; }

    public required virtual Company Company { get; set; }
}
