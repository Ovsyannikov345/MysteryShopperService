using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Data;

public class MysteryShopperDbContext : DbContext
{
    public MysteryShopperDbContext()
    { }

    public MysteryShopperDbContext(DbContextOptions<MysteryShopperDbContext> options) : base(options)
    {
    }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<CompanyReview> CompanyReviews { get; set; }

    public virtual DbSet<ContactPerson> ContactPeople { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<ReportCorrection> ReportCorrections { get; set; }

    public virtual DbSet<SupportRequest> SupportRequests { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserOrder> UserOrders { get; set; }

    public virtual DbSet<UserReview> UserReviews { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public override int SaveChanges()
    {
        AddTimestamps();

        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddTimestamps();

        return await base.SaveChangesAsync(cancellationToken);
    }

    private void AddTimestamps()
    {
        var entities = ChangeTracker.Entries()
            .Where(x => x.Entity is EntityBase && (x.State == EntityState.Added || x.State == EntityState.Modified));

        foreach (var entity in entities)
        {
            var now = DateTime.UtcNow;

            if (entity.State == EntityState.Added)
            {
                ((EntityBase)entity.Entity).CreatedAt = now;
            }
            else
            {
                entity.Property(nameof(EntityBase.CreatedAt)).IsModified = false;
            }

            ((EntityBase)entity.Entity).UpdatedAt = now;
        }
    }
}
