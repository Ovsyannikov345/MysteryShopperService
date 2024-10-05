using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.DAL.Data
{
    public class MysteryShopperDbContext : DbContext
    {
        public MysteryShopperDbContext() { }

        public MysteryShopperDbContext(DbContextOptions<MysteryShopperDbContext> options) : base(options) { }

        public virtual DbSet<Company> Companies { get; set; }

        public virtual DbSet<CompanyReview> CompanyReviews { get; set; }

        public virtual DbSet<ContactPerson> ContactPeople { get; set; }

        public virtual DbSet<Dispute> Disputes { get; set; }

        public virtual DbSet<Notification> Notifications { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<Report> Reports { get; set; }

        public virtual DbSet<ReportCorrection> ReportCorrections { get; set; }

        public virtual DbSet<Request> Requests { get; set; }

        public virtual DbSet<SupportRequest> SupportRequests { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<UserOrder> UserOrders { get; set; }

        public virtual DbSet<UserReview> UserReviews { get; set; }
    }
}


