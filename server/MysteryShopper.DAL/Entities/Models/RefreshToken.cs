namespace MysteryShopper.DAL.Entities.Models
{
    public partial class RefreshToken : EntityBase
    {
        public string Token { get; set; } = string.Empty;
    }
}
