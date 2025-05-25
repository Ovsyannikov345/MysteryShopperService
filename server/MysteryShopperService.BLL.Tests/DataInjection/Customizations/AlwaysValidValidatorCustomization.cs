using AutoFixture;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopperService.BLL.Tests.Validators;

namespace MysteryShopperService.BLL.Tests.DataInjection.Customizations;

public class AlwaysValidValidatorCustomization : ICustomization
{
    public void Customize(IFixture fixture)
    {
        fixture.Register<UserRegistrationValidator>(() =>
            new AlwaysValidUserValidator());
        fixture.Register<CompanyRegistrationValidator>(() =>
            new AlwaysValidCompanyValidator());
        fixture.Register<OrderCreationValidator>(() =>
            new AlwaysValidOrderValidator());
        fixture.Register<ReportValidator>(() =>
            new AlwaysValidReportValidator());
    }
}
