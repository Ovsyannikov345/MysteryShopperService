using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MysteryShopper.BLL.Dto;
using MysteryShopper.BLL.Services.IServices;

namespace MysteryShopper.API.Controllers
{
    [ApiController]
    [Route("auth/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginAsync(LoginData loginData, CancellationToken cancellationToken = default)
        {
            var tokens = await _authService.LoginAsync(loginData.Email, loginData.Password, cancellationToken);

            return Ok(tokens);
        }

        [HttpPost("register/company")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterCompanyAsync(CompanyRegistrationCredentials companyCredentials, CancellationToken cancellationToken = default)
        {
            var tokens = await _authService.RegisterCompany(companyCredentials, cancellationToken);

            return Ok(tokens);
        }

        [HttpPost("register/user")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUserAsync(UserRegistrationCredentials userCredentials, CancellationToken cancellationToken = default)
        {
            var tokens = await _authService.RegisterUser(userCredentials, cancellationToken);

            return Ok(tokens);
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> LogoutAsync([FromQuery] string refreshToken, CancellationToken cancellationToken = default)
        {
            await _authService.LogoutAsync(refreshToken, cancellationToken);

            return Ok();
        }
    }
}
