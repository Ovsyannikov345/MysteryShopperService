using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class UserReview
{
    public int Id { get; set; }

    public string? Text { get; set; }

    public short Grade { get; set; }

    public int? CompanyId { get; set; }

    public int? ReportId { get; set; }

    public virtual Company? Company { get; set; }

    public virtual Report? Report { get; set; }
}
