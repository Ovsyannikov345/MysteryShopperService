namespace MysteryShopper.DAL.Entities.Models
{
    public partial class Category
    {
        public Guid Id { get; set; }

        public required string Name { get; set; }

        public virtual ICollection<OrderTag> Tags { get; set; } = [];
    }
}
