using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;
using newstreetbackend.Model;
using newstreetbackend.Repository;

namespace newstreetbackend.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IShopRepository _shopRepository;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUserRepository userRepository,
        IShopRepository shopRepository,
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _shopRepository = shopRepository;
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetUserByEmailAsync(request.Email);
        if (user == null) return null;

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        var shopId = user.OwnedShop?.Id;
        var token = GenerateJwtToken(user.Email, user.Role, shopId);

        return new AuthResponse
        {
            Token = token,
            Email = user.Email,
            Role = user.Role,
            ShopId = shopId
        };
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request, Guid? cityId)
    {
        var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
        if (existingUser != null) return null;

        // Validate shop owner registration
        if (request.Role == "ShopOwner")
        {
            if (string.IsNullOrWhiteSpace(request.ShopName) || 
                string.IsNullOrWhiteSpace(request.Address) || 
                string.IsNullOrWhiteSpace(request.Phone))
            {
                throw new ArgumentException("Shop name, address, and phone are required for shop owner registration.");
            }

            if (!cityId.HasValue)
            {
                throw new ArgumentException("City ID is required for shop owner registration.");
            }
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            Guid? shopId = null;

            // Create shop for shop owners
            if (request.Role == "ShopOwner" && cityId.HasValue)
            {
                var slug = GenerateSlug(request.ShopName);
                
                // Ensure slug is unique within the city
                var existingShop = await _shopRepository.GetShopBySlugAsync(slug, cityId.Value);
                if (existingShop != null)
                {
                    slug = $"{slug}-{Guid.NewGuid().ToString().Substring(0, 8)}";
                }

                var shop = new Shop
                {
                    Name = request.ShopName,
                    Slug = slug,
                    Address = request.Address,
                    Phone = request.Phone,
                    WhatsApp = request.WhatsApp,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude,
                    CityId = cityId.Value,
                    OwnerId = user.Id,
                    Status = "pending" // New shops start as pending until verified
                };

                _context.Shops.Add(shop);
                await _context.SaveChangesAsync();
                shopId = shop.Id;
            }

            await transaction.CommitAsync();

            var token = GenerateJwtToken(user.Email, user.Role, shopId);

            return new AuthResponse
            {
                Token = token,
                Email = user.Email,
                Role = user.Role,
                ShopId = shopId
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static string GenerateSlug(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // Convert to lowercase
        var slug = input.ToLowerInvariant();

        // Replace spaces and special characters with hyphens
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", " ").Trim();
        slug = Regex.Replace(slug, @"\s", "-");

        // Remove multiple consecutive hyphens
        slug = Regex.Replace(slug, @"-+", "-");

        return slug;
    }

    public string GenerateJwtToken(string email, string role, Guid? shopId)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSecretKeyForJWTTokenGeneration123456789");
        var issuer = _configuration["Jwt:Issuer"] ?? "StreetMain";
        var audience = _configuration["Jwt:Audience"] ?? "StreetMainUsers";
        var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "1440"); // 24 hours default

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (shopId.HasValue)
        {
            claims.Add(new Claim("ShopId", shopId.Value.ToString()));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
