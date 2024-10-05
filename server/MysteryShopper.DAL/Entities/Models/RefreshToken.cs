namespace MysteryShopper.DAL.Entities.Models
{
    public partial class RefreshToken
    {
        public Guid Id { get; set; }

        public string Token { get; set; } = string.Empty;
    }
}
