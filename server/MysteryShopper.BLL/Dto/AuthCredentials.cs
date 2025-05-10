using MysteryShopper.BLL.Utilities.Constants;

namespace MysteryShopper.BLL.Dto;

public class AuthCredentials
{
    public required string AccessToken { get; set; }

    public required string RefreshToken { get; set; }

    public Role Role { get; set; }
}
