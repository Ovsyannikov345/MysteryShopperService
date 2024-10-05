using AutoMapper;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Validators;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
using Serilog;

namespace MysteryShopper.BLL.Services
{
    public class AuthService(
        ILogger logger,
        IMapper mapper,
        IUserRepository userRepository,
        ICompanyRepository companyRepository,
        ITokenService tokenService,
        UserRegistrationValidator userRegistrationValidator,
        CompanyRegistrationValidator companyRegistrationValidator) : IAuthService
    {
        private readonly IUserRepository _userRepository = userRepository;

        private readonly ICompanyRepository _companyRepository = companyRepository;

        private readonly ITokenService _tokenService = tokenService;

        private readonly IMapper _mapper = mapper;

        private readonly ILogger _logger = logger;

        private readonly UserRegistrationValidator _userRegistrationValidator = userRegistrationValidator;

        private readonly CompanyRegistrationValidator _companyRegistrationValidator = companyRegistrationValidator;

        public async Task<TokenPair> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.GetByItemAsync(u => u.Email == email, cancellationToken);

            if (user is null)
            {
                var company = await _companyRepository.GetByItemAsync(c => c.Email == email, cancellationToken);

                if (company is null)
                {
                    _logger.Warning("User or company with email {0} is not found", email);

                    throw new UnauthorizedException("Provided credentials are invalid");
                }

                if (!BCrypt.Net.BCrypt.Verify(password, company.Password))
                {
                    _logger.Warning("Invalid credentials for company {0}", company.Id);

                    throw new UnauthorizedException("Provided credentials are invalid");
                }

                _logger.Information("Company {0} logged in successfully", company.Id);

                return await _tokenService.GetTokensAsync(company, cancellationToken);
            }

            if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                _logger.Warning("Invalid credentials for user {0}", user.Id);

                throw new UnauthorizedException("Provided credentials are invalid");
            }

            _logger.Information("User {0} logged in successfully", user.Id);

            return await _tokenService.GetTokensAsync(user, cancellationToken);
        }

        public async Task LogoutAsync(string refreshToken, CancellationToken cancellationToken = default)
        {
            await _tokenService.RemoveRefreshTokenAsync(refreshToken, cancellationToken);
            _logger.Information("User or company logged out successfully. RefreshToken: {0}", refreshToken);
        }

        public async Task<TokenPair> RegisterUser(UserRegistrationCredentials userData, CancellationToken cancellationToken = default)
        {
            var validationResult = _userRegistrationValidator.Validate(userData);

            if (!validationResult.IsValid)
            {
                _logger.Information("User credentials are invalid. Reason: {0}", validationResult.Errors[0].ErrorMessage);

                throw new BadRequestException($"{validationResult.Errors[0].ErrorMessage}");
            }

            if ((await _userRepository.GetByItemAsync(u => u.Email == userData.Email, cancellationToken)) != null)
            {
                _logger.Information("User email {0} is taken", userData.Email);

                throw new BadRequestException("Email is taken");
            }

            var user = _mapper.Map<User>(userData);

            user.Password = BCrypt.Net.BCrypt.HashPassword(userData.Password);

            var createdUser = await _userRepository.AddAsync(user, cancellationToken);

            _logger.Information("User {0} registered successfully", createdUser.Id);

            return await _tokenService.GetTokensAsync(createdUser, cancellationToken);
        }

        public async Task<TokenPair> RegisterCompany(CompanyRegistrationCredentials companyData, CancellationToken cancellationToken = default)
        {
            var validationResult = _companyRegistrationValidator.Validate(companyData);

            if (!validationResult.IsValid)
            {
                _logger.Information("Company credentials are invalid. Reason: {0}", validationResult.Errors[0].ErrorMessage);

                throw new BadRequestException($"{validationResult.Errors[0].ErrorMessage}");
            }

            if ((await _companyRepository.GetByItemAsync(c => c.Email == companyData.Email, cancellationToken)) != null)
            {
                _logger.Information("Company email {0} is taken", companyData.Email);

                throw new BadRequestException("Company email is taken");
            }

            var company = _mapper.Map<Company>(companyData);

            company.Password = BCrypt.Net.BCrypt.HashPassword(companyData.Password);

            var createdCompany = await _companyRepository.AddAsync(company, cancellationToken);

            _logger.Information("Company {0} registered successfully", createdCompany.Id);

            return await _tokenService.GetTokensAsync(createdCompany, cancellationToken);
        }
    }
}
