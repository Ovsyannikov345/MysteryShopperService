using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class SupportRequest
{
    public int Id { get; set; }

    public string? Text { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? UserId { get; set; }

    public int? CompanyId { get; set; }

    public virtual Company? Company { get; set; }

    public virtual User? User { get; set; }
}
