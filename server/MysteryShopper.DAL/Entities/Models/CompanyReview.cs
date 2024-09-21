using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class CompanyReview
{
    public int Id { get; set; }

    public string? Text { get; set; }

    public short Grade { get; set; }

    public int? UserId { get; set; }

    public int? OrderId { get; set; }

    public virtual Order? Order { get; set; }

    public virtual User? User { get; set; }
}
