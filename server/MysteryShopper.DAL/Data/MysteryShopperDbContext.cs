using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Data
{
    public class MysteryShopperDbContext : DbContext
    {
        public MysteryShopperDbContext() { }

        public MysteryShopperDbContext(DbContextOptions<MysteryShopperDbContext> options) : base(options)
        {
            if (Database.IsRelational())
            {
                Database.Migrate();
            }
        }

        public virtual DbSet<Company> Companies { get; set; }

        public virtual DbSet<CompanyReview> CompanyReviews { get; set; }

        public virtual DbSet<ContactPerson> ContactPeople { get; set; }

        public virtual DbSet<Dispute> Disputes { get; set; }

        public virtual DbSet<Notification> Notifications { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<Report> Reports { get; set; }

        public virtual DbSet<ReportCorrection> ReportCorrections { get; set; }

        public virtual DbSet<SupportRequest> SupportRequests { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<UserOrder> UserOrders { get; set; }

        public virtual DbSet<UserReview> UserReviews { get; set; }

        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>()
                .Property(c => c.CreatedAt)
                    .HasDefaultValueSql("now()");

            modelBuilder.Entity<CompanyReview>()
                .Property(o => o.CreatedAt)
                    .HasDefaultValueSql("now()");

            modelBuilder.Entity<Dispute>()
                .Property(d => d.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<Notification>()
                .Property(n => n.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<Order>()
                .Property(o => o.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<Report>()
                .Property(r => r.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<ReportCorrection>()
                .Property(r => r.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<SupportRequest>()
                .Property(s => s.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<UserOrder>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<UserReview>()
                .Property(u => u.CreatedAt)
                .HasDefaultValueSql("now()");
        }
    }
}
