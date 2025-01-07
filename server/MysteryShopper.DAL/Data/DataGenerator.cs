﻿using BCrypt.Net;
using Bogus;
using Microsoft.EntityFrameworkCore;
using MysteryShopper.DAL.Entities.Enums;
using MysteryShopper.DAL.Entities.Models;
using System;
using System.Collections.Generic;

namespace MysteryShopper.DAL.Data;

public static class DataGenerator
{
    public static List<User> GenerateUsers(int count)
    {
        var userFaker = new Faker<User>()
            .RuleFor(u => u.Id, f => Guid.NewGuid())
            .RuleFor(u => u.Name, f => f.Name.FirstName())
            .RuleFor(u => u.Surname, f => f.Name.LastName())
            .RuleFor(u => u.BirthDate, f => f.Date.Past(40, DateTime.UtcNow.AddYears(-18)))
            .RuleFor(u => u.Gender, f => f.PickRandom<GenderType>())
            .RuleFor(u => u.WorkingExperience, f => f.Name.JobTitle())
            .RuleFor(u => u.City, f => f.Address.City())
            .RuleFor(u => u.Phone, f => f.Phone.PhoneNumber())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Description, f => f.Lorem.Paragraph())
            .RuleFor(c => c.Password, f => BCrypt.Net.BCrypt.HashPassword("qweqweqwe"))
            .RuleFor(u => u.CreatedAt, f => f.Date.Past(3));

        return userFaker.Generate(count);
    }

    public static List<Company> GenerateCompanies(int count)
    {
        var contactPersonFaker = new Faker<ContactPerson>()
            .RuleFor(c => c.Name, f => f.Person.FirstName)
            .RuleFor(c => c.Surname, f => f.Person.LastName)
            .RuleFor(c => c.Patronymic, f => f.Person.Random.Word().OrNull(f))
            .RuleFor(c => c.Phone, f => f.Person.Phone)
            .RuleFor(c => c.Email, f => f.Person.Email);

        var companyFaker = new Faker<Company>()
            .RuleFor(c => c.Id, f => Guid.NewGuid())
            .RuleFor(c => c.Name, f => f.Company.CompanyName())
            .RuleFor(c => c.Email, f => f.Internet.Email())
            .RuleFor(c => c.Password, f => BCrypt.Net.BCrypt.HashPassword("qweqweqwe"))
            .RuleFor(c => c.CreatedAt, f => f.Date.Past(5))
            .RuleFor(c => c.ContactPerson, f => contactPersonFaker.Generate(1)[0]);

        return companyFaker.Generate(count);
    }

    public static List<Order> GenerateOrders(int count, List<Guid> companyIds)
    {
        var orderFaker = new Faker<Order>()
            .RuleFor(o => o.Id, f => Guid.NewGuid())
            .RuleFor(o => o.Title, f => f.Commerce.ProductName())
            .RuleFor(o => o.Description, f => f.Lorem.Sentence(10))
            .RuleFor(o => o.Place, f => f.Address.City())
            .RuleFor(o => o.TimeToComplete, f => TimeSpan.FromMinutes(f.Random.Int(60, 1500)))
            .RuleFor(o => o.Price, f => f.Random.Int(100, 5000))
            .RuleFor(o => o.CreatedAt, f => f.Date.Past(1))
            .RuleFor(o => o.Lat, f => f.Address.Latitude())
            .RuleFor(o => o.Lng, f => f.Address.Longitude())
            .RuleFor(o => o.IsClosed, f => f.Random.Bool())
            .RuleFor(o => o.CompanyId, f => f.PickRandom(companyIds));

        return orderFaker.Generate(count);
    }

    public static List<UserOrder> GenerateUserOrders(List<Guid> userIds, List<Guid> orderIds)
    {
        var userOrderFaker = new Faker<UserOrder>()
            .RuleFor(u => u.Status, f => f.PickRandom<UserOrderStatus>());

        List<UserOrder> userOrders = new List<UserOrder>();

        userIds = [.. userIds.OrderBy(_ => Guid.NewGuid())];
        orderIds = [.. orderIds.OrderBy(_ => Guid.NewGuid())];

        int count = Math.Min(userIds.Count, orderIds.Count);

        for (int i = 0; i < count; i++)
        {
            var userOrder = userOrderFaker.Generate();

            userOrder.UserId = userIds[i];
            userOrder.OrderId = orderIds[i];
            userOrders.Add(userOrder);
        }

        return userOrders;
    }

    public static List<UserReview> GenerateUserReviews(int count, List<Guid> userIds, List<Guid> companyIds, List<Guid> orderIds)
    {
        var reviewFaker = new Faker<UserReview>()
            .RuleFor(r => r.Id, f => Guid.NewGuid())
            .RuleFor(r => r.Text, f => f.Lorem.Sentence(10))
            .RuleFor(r => r.Grade, f => f.Random.Short(1, 5))
            .RuleFor(r => r.CreatedAt, f => f.Date.Past(1))
            .RuleFor(r => r.UserId, f => f.PickRandom(userIds))
            .RuleFor(r => r.CompanyId, f => f.PickRandom(companyIds))
            .RuleFor(r => r.OrderId, f => f.PickRandom(orderIds));

        return reviewFaker.Generate(count);
    }

    public static List<CompanyReview> GenerateCompanyReviews(int count, List<Guid> userIds, List<Guid> companyIds, List<Guid> orderIds)
    {
        var reviewFaker = new Faker<CompanyReview>()
            .RuleFor(r => r.Id, f => Guid.NewGuid())
            .RuleFor(r => r.Text, f => f.Lorem.Sentence(10))
            .RuleFor(r => r.Grade, f => f.Random.Short(1, 5))
            .RuleFor(r => r.CreatedAt, f => f.Date.Past(1))
            .RuleFor(r => r.UserId, f => f.PickRandom(userIds))
            .RuleFor(r => r.CompanyId, f => f.PickRandom(companyIds))
            .RuleFor(r => r.OrderId, f => f.PickRandom(orderIds));

        return reviewFaker.Generate(count);
    }

    public static List<Notification> GenerateNotifications(int count, List<Guid> userIds, List<Guid> companyIds)
    {
        var notificationFaker = new Faker<Notification>()
            .RuleFor(n => n.Id, f => Guid.NewGuid())
            .RuleFor(n => n.Text, f => f.Lorem.Sentence(10))
            .RuleFor(n => n.IsRead, f => f.Random.Bool())
            .RuleFor(n => n.CreatedAt, f => f.Date.Recent(30))
            .RuleFor(n => n.UserId, f => f.PickRandom(userIds))
            .RuleFor(n => n.CompanyId, f => f.PickRandom(companyIds));

        return notificationFaker.Generate(count);
    }

    public static void GenerateAndSeedDatabase(MysteryShopperDbContext context)
    {
        // Generate Users
        var users = GenerateUsers(20);
        context.Users.AddRange(users);
        context.SaveChanges();
        // Generate Companies
        var companies = GenerateCompanies(20);
        context.Companies.AddRange(companies);
        context.SaveChanges();

        // Generate Orders
        var orders = GenerateOrders(100, companies.Select(c => c.Id).ToList());
        context.Orders.AddRange(orders);
        context.SaveChanges();

        // Generate UserOrders
        var userOrders = GenerateUserOrders(users.Select(u => u.Id).ToList(), orders.Select(o => o.Id).ToList());
        context.UserOrders.AddRange(userOrders);
        context.SaveChanges();

        // Generate User Reviews
        var userReviews = GenerateUserReviews(
            200,
            users.Select(u => u.Id).ToList(),
            companies.Select(c => c.Id).ToList(),
            orders.Select(o => o.Id).ToList()
        );
        context.UserReviews.AddRange(userReviews);
        context.SaveChanges();

        // Generate Company Reviews
        var companyReviews = GenerateCompanyReviews(
            200,
            users.Select(u => u.Id).ToList(),
            companies.Select(c => c.Id).ToList(),
            orders.Select(o => o.Id).ToList()
        );
        context.CompanyReviews.AddRange(companyReviews);
        context.SaveChanges();

        // Generate Notifications
        var notifications = GenerateNotifications(
            150,
            users.Select(u => u.Id).ToList(),
            companies.Select(c => c.Id).ToList()
        );
        context.Notifications.AddRange(notifications);
        context.SaveChanges();
    }
}

