using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.API.ViewModels;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;
using System.Net;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController(IAuthService authService, IMapper mapper) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<AuthCredentials> LoginAsync(LoginData loginData, CancellationToken cancellationToken = default)
        {
            var credentials = await _authService.LoginAsync(loginData.Email, loginData.Password, cancellationToken);

            return credentials;
        }

        [HttpPost("check-email")]
        [AllowAnonymous]
        public async Task<EmailAvailabilityViewModel> CheckEmailAvailability([FromBody] string email, CancellationToken cancellationToken = default)
        {
            return new EmailAvailabilityViewModel { Available = await _authService.IsEmailAvailableAsync(email, cancellationToken) };
        }

        [HttpPost("register/company")]
        [AllowAnonymous]
        public async Task<AuthCredentials> RegisterCompanyAsync(CompanyRegistrationCredentials companyCredentials, CancellationToken cancellationToken = default)
        {
            var credentials = await _authService.RegisterCompany(companyCredentials, cancellationToken);

            return credentials;
        }

        [HttpPost("register/user")]
        [AllowAnonymous]
        public async Task<AuthCredentials> RegisterUserAsync(UserRegistrationCredentials userCredentials, CancellationToken cancellationToken = default)
        {
            var credentials = await _authService.RegisterUser(userCredentials, cancellationToken);

            return credentials;
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task LogoutAsync([FromQuery] string refreshToken, CancellationToken cancellationToken = default)
        {
            await _authService.LogoutAsync(refreshToken, cancellationToken);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<TokenPairViewModel> RefreshTokensAsync([FromQuery] string refreshToken, CancellationToken cancellationToken = default)
        {
            var tokens = await _authService.RefreshTokensAsync(refreshToken, cancellationToken);

            return mapper.Map<TokenPairViewModel>(tokens);
        }
    }
}
