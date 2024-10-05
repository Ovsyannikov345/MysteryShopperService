using MysteryShopper.DAL.Data;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using ReviewGuru.DAL.Repositories;
using Serilog;

namespace MysteryShopper.DAL.Repositories
{
    public class CompanyRepository(MysteryShopperDbContext context, ILogger logger) : GenericRepository<Company>(context, logger), ICompanyRepository
    {
    }
}
