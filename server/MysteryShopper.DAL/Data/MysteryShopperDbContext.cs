using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Data
{
    public class MysteryShopperDbContext(DbContextOptions<MysteryShopperDbContext> options) : DbContext(options)
    {
        public virtual DbSet<Company> Companies { get; set; }

        public virtual DbSet<CompanyReview> CompanyReviews { get; set; }

        public virtual DbSet<ContactPerson> ContactPeople { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<Report> Reports { get; set; }

        public virtual DbSet<Request> Requests { get; set; }

        public virtual DbSet<SupportRequest> SupportRequests { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<UserReview> UserReviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("Companies_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .HasColumnName("email");
                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("name");
                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .HasColumnName("password");
            });

            modelBuilder.Entity<CompanyReview>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("CompanyReviews_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Grade).HasColumnName("grade");
                entity.Property(e => e.Text)
                    .HasMaxLength(255)
                    .HasColumnName("text");

                entity.HasOne(d => d.Order).WithMany(p => p.CompanyReviews)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("CompanyReviews_OrderId_fkey");

                entity.HasOne(d => d.User).WithMany(p => p.CompanyReviews)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("CompanyReviews_UserId_fkey");
            });

            modelBuilder.Entity<ContactPerson>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("ContactPeople_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .HasColumnName("email");
                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("name");
                entity.Property(e => e.Patronymic)
                    .HasMaxLength(255)
                    .HasColumnName("patronymic");
                entity.Property(e => e.Phone)
                    .HasMaxLength(255)
                    .HasColumnName("phone");
                entity.Property(e => e.Surname)
                    .HasMaxLength(255)
                    .HasColumnName("surname");

                entity.HasOne(d => d.Company).WithMany(p => p.ContactPeople)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("ContactPeople_CompanyId_fkey");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("Orders_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CompletionTime).HasColumnName("completionTime");
                entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .HasColumnName("description");
                entity.Property(e => e.Lat).HasColumnName("lat");
                entity.Property(e => e.Lng).HasColumnName("lng");
                entity.Property(e => e.Place)
                    .HasMaxLength(255)
                    .HasColumnName("place");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .HasColumnName("title");

                entity.HasOne(d => d.Company).WithMany(p => p.Orders)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("Orders_CompanyId_fkey");
            });

            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("Reports_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .HasColumnName("description");
                entity.Property(e => e.Grade).HasColumnName("grade");
                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .HasColumnName("title");

                entity.HasOne(d => d.Order).WithMany(p => p.Reports)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("Reports_OrderId_fkey");

                entity.HasOne(d => d.User).WithMany(p => p.Reports)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("Reports_UserId_fkey");
            });

            modelBuilder.Entity<Request>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("Requests_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Accepted).HasColumnName("accepted");
                entity.Property(e => e.Rejected).HasColumnName("rejected");

                entity.HasOne(d => d.Order).WithMany(p => p.Requests)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("Requests_OrderId_fkey");

                entity.HasOne(d => d.User).WithMany(p => p.Requests)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("Requests_UserId_fkey");
            });

            modelBuilder.Entity<SupportRequest>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("SupportRequests_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
                entity.Property(e => e.Text)
                    .HasMaxLength(255)
                    .HasColumnName("text");

                entity.HasOne(d => d.Company).WithMany(p => p.SupportRequests)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("SupportRequests_CompanyId_fkey");

                entity.HasOne(d => d.User).WithMany(p => p.SupportRequests)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("SupportRequests_UserId_fkey");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("Users_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Age).HasColumnName("age");
                entity.Property(e => e.City)
                    .HasMaxLength(255)
                    .HasColumnName("city");
                entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .HasColumnName("description");
                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .HasColumnName("email");
                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("name");
                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .HasColumnName("password");
                entity.Property(e => e.Patronymic)
                    .HasMaxLength(255)
                    .HasColumnName("patronymic");
                entity.Property(e => e.Phone)
                    .HasMaxLength(255)
                    .HasColumnName("phone");
                entity.Property(e => e.Surname)
                    .HasMaxLength(255)
                    .HasColumnName("surname");

                entity.HasMany(d => d.Orders).WithMany(p => p.Users)
                    .UsingEntity<Dictionary<string, object>>(
                        "UserOrder",
                        r => r.HasOne<Order>().WithMany()
                            .HasForeignKey("OrderId")
                            .HasConstraintName("UserOrders_OrderId_fkey"),
                        l => l.HasOne<User>().WithMany()
                            .HasForeignKey("UserId")
                            .HasConstraintName("UserOrders_UserId_fkey"),
                        j =>
                        {
                            j.HasKey("UserId", "OrderId").HasName("UserOrders_pkey");
                            j.ToTable("UserOrders");
                        });
            });

            modelBuilder.Entity<UserReview>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("UserReviews_pkey");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Grade).HasColumnName("grade");
                entity.Property(e => e.Text)
                    .HasMaxLength(255)
                    .HasColumnName("text");

                entity.HasOne(d => d.Company).WithMany(p => p.UserReviews)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("UserReviews_CompanyId_fkey");

                entity.HasOne(d => d.Report).WithMany(p => p.UserReviews)
                    .HasForeignKey(d => d.ReportId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("UserReviews_ReportId_fkey");
            });
        }
    }
}


