namespace MysteryShopper.DAL.Entities.Models;

public partial class Request
{
    public Guid Id { get; set; }

    public bool IsAccepted { get; set; }

    public bool IsRejected { get; set; }

    public Guid UserId { get; set; }

    public Guid OrderId { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
