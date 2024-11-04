namespace MysteryShopper.DAL.Entities.Models
{
    public partial class OrderTag
    {
        public Guid Id { get; set; }

        public required string Text { get; set; }

        public Guid CategoryId { get; set; }

        public virtual required Category Category { get; set; }

        public virtual ICollection<Order> Orders { get; set; } = [];
    }
}
