namespace MysteryShopper.DAL.Entities.Models
{
    public partial class Category : EntityBase
    {
        public required string Name { get; set; }

        public virtual ICollection<OrderTag> Tags { get; set; } = [];
    }
}
