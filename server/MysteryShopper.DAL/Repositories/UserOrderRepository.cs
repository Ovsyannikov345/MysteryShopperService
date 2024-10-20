﻿using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using ReviewGuru.DAL.Repositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class UserOrderRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<UserOrder>(context, logger), IUserOrderRepository
    {
        private readonly MysteryShopperDbContext _context = context;

        public async Task<UserOrder?> GetUserOrder(Guid userId, Guid orderId, CancellationToken cancellationToken = default)
        {
            return await _context.UserOrders.AsNoTracking()
                .Include(o => o.Order)
                    .ThenInclude(o => o.Company)
                        .ThenInclude(c => c.CompanyReviews)
                .FirstOrDefaultAsync(o => o.UserId == userId && o.OrderId == orderId, cancellationToken);
        }
    }
}