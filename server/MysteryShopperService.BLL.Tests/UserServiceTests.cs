using AutoFixture.Xunit2;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using MysteryShopperService.BLL.Tests.DataInjection;
using NSubstitute;
using Shouldly;
using System.Linq.Expressions;

namespace MysteryShopperService.BLL.Tests;

public class UserServiceTests
{
    private readonly CancellationToken cancellationToken = CancellationToken.None;

    [Theory, AutoDomainData]
    public async Task GetProfileAsync_ProfileNotFound_Throws(
        [Frozen] IUserRepository userRepository,
        UserService userService)
    {
        userRepository.GetUserWithReviewsAsync(Arg.Any<Expression<Func<User, bool>>>(), cancellationToken)
            .Returns((User?)null);

        userService.GetProfileAsync(Guid.NewGuid(), cancellationToken).ShouldThrowAsync<NotFoundException>();
    }

    [Theory, AutoDomainData]
    public async Task GetProfileAsync_ProfileFound_ReturnsProfile(
        [Frozen] IUserRepository userRepository,
        UserService userService,
        User user)
    {
        userRepository.GetUserWithReviewsAsync(Arg.Any<Expression<Func<User, bool>>>(), cancellationToken)
            .Returns(user);

        var result = await userService.GetProfileAsync(Guid.NewGuid(), cancellationToken);

        result.ShouldBeEquivalentTo(user);
    }

    [Theory, AutoDomainData]
    public async Task UpdateProfileInfoAsync_IdMismatch_Throws(
        UserService userService,
        UserToUpdateModel user)
    {
        await userService.UpdateProfileInfoAsync(Guid.NewGuid(), user, cancellationToken).ShouldThrowAsync<ForbiddenException>();
    }

    [Theory, AutoDomainData]
    public async Task UpdateProfileInfoAsync_ValidFlow_ReturnsUpdatedProfile(
        [Frozen] IUserRepository userRepository,
        UserService userService,
        User user)
    {
        var userToUpdateModel = new UserToUpdateModel()
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Phone = user.Phone,
            Description = "Updated description",
            WorkingExperience = " ",
        };

        var updatedUser = new User()
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Phone = user.Phone,
            Email = user.Email,
            Password = user.Password,
            Description = "Updated description",
            WorkingExperience = null,
        };

        userRepository.GetAsync(Arg.Any<Expression<Func<User, bool>>>(), disableTracking: false, cancellationToken)
            .Returns(user);
        userRepository.GetUserWithReviewsAsync(Arg.Any<Expression<Func<User, bool>>>(), cancellationToken)
            .Returns(updatedUser);

        var result = await userService.UpdateProfileInfoAsync(user.Id, userToUpdateModel, cancellationToken);

        result.Description.ShouldBe(updatedUser.Description);
        result.WorkingExperience.ShouldBe(updatedUser.WorkingExperience);
    }
}
