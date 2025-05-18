using AutoFixture;
using AutoFixture.AutoNSubstitute;
using AutoFixture.Community.AutoMapper;
using AutoFixture.Xunit2;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopperService.BLL.Tests.DataInjection.Customizations;

namespace MysteryShopperService.BLL.Tests.DataInjection;

public class AutoDomainDataAttribute : AutoDataAttribute
{
    public AutoDomainDataAttribute()
        : base(CreateFixture)
    {
    }

    private static IFixture CreateFixture()
    {
        var fixture = new Fixture()
            .Customize(new AutoNSubstituteCustomization())
            .Customize(new AutoMapperCustomization(x => x.AddMaps(typeof(AutoMapperProfile))))
            .Customize(new AlwaysValidValidatorCustomization());

        var behaviors = fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList();

        foreach (var behavior in behaviors)
        {
            fixture.Behaviors.Remove(behavior);
        }

        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        return fixture;
    }
}
