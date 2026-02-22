using newstreetbackend.Model;

namespace newstreetbackend.Services;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<AuthResponse?> RegisterAsync(RegisterRequest request, Guid? cityId);
    string GenerateJwtToken(string email, string role, Guid? shopId);
}
