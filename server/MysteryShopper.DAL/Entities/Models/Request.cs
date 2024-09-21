using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Entities.Models;

public partial class Request
{
    public int Id { get; set; }

    public bool Accepted { get; set; }

    public int? UserId { get; set; }

    public int? OrderId { get; set; }

    public bool Rejected { get; set; }

    public virtual Order? Order { get; set; }

    public virtual User? User { get; set; }
}
