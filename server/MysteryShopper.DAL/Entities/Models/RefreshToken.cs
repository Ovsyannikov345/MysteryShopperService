namespace MysteryShopper.DAL.Entities.Models;

public partial class RefreshToken : EntityBase
{
    public required string Token { get; set; }
}
