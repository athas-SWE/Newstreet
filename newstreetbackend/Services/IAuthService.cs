using newstreetbackend.Model;

namespace newstreetbackend.Services;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    string GenerateJwtToken(string email, string role, Guid? shopId);
}
