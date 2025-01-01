using System.ComponentModel.DataAnnotations;

namespace MysteryShopper.DAL.Entities.Models;

public partial class ContactPerson : EntityBase
{
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Surname { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Patronymic { get; set; }

    [MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    public Guid CompanyId { get; set; }

    public virtual Company Company { get; set; } = null!;
}
