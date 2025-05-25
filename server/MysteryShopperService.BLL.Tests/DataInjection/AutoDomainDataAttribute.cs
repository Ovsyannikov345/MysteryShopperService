using AutoFixture;
using AutoFixture.AutoNSubstitute;
using AutoFixture.Community.AutoMapper;
using AutoFixture.Xunit2;
using Microsoft.Extensions.Configuration;
using MysteryShopper.BLL.Utilities.Mapping;
using MysteryShopperService.BLL.Tests.DataInjection.Customizations;
using NSubstitute;

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

        fixture.Behaviors.Add(new OmitOnRecursionBehavior(1));

        AddConfiguration(fixture);

        return fixture;
    }

    private static void AddConfiguration(IFixture fixture)
    {
        var configuration = Substitute.For<IConfiguration>();

        configuration["Jwt:Issuer"].Returns("ISSUER");
        configuration["Jwt:AccessSecretKey"].Returns("asjkdghfkjsjdfkgsadjfhjsagdfjshadkjfghjsadhfsakjdfhkshjf");
        configuration["Jwt:RefreshSecretKey"].Returns("edwtrfygfuhshkbofaghvyfefyfiwskgaporehgdsusageofyureawg");
        configuration["Jwt:AccessMinutesExpire"].Returns("10");
        configuration["Jwt:RefreshDaysExpire"].Returns("3");

        // Stub section for Jwt:Audiences
        var audienceSection = Substitute.For<IConfigurationSection>();

        var audienceChildren = new[]
        {
            CreateSection("0", "AUD1"),
            CreateSection("1", "AUD2"),
        };

        audienceSection.GetChildren().Returns(audienceChildren);
        configuration.GetSection("Jwt:Audiences").Returns(audienceSection);

        fixture.Inject(configuration);
    }

    private static IConfigurationSection CreateSection(string key, string value)
    {
        var section = Substitute.For<IConfigurationSection>();

        section.Key.Returns(key);
        section.Value.Returns(value);

        return section;
    }
}
