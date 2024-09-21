using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class ContactPerson
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public string? Patronymic { get; set; }

    public string Phone { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int? CompanyId { get; set; }

    public virtual Company? Company { get; set; }
}
