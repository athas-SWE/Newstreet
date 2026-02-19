using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;
using newstreetbackend.Model;
using newstreetbackend.Repository;

namespace newstreetbackend.Services;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;
    private readonly ApplicationDbContext _context;

    public AdminService(IAdminRepository adminRepository, ApplicationDbContext context)
    {
        _adminRepository = adminRepository;
        _context = context;
    }

    // Shops

    public async Task<(List<AdminShopDto> items, int totalCount)> GetShopsAsync(
        string? citySlug,
        string? status,
        bool? isVerified,
        int page,
        int pageSize)
    {
        var shops = await _adminRepository.GetAllShopsAsync(citySlug, status, isVerified, page, pageSize);
        var total = await _adminRepository.GetAllShopsCountAsync(citySlug, status, isVerified);

        return (shops.Select(MapShopToAdminDto).ToList(), total);
    }

    public async Task<(List<AdminShopDto> items, int totalCount)> GetPendingShopsAsync(int page, int pageSize)
    {
        var shops = await _adminRepository.GetShopsPendingVerificationAsync(page, pageSize);
        var total = await _adminRepository.GetShopsPendingVerificationCountAsync();

        return (shops.Select(MapShopToAdminDto).ToList(), total);
    }

    public async Task VerifyShopAsync(Guid shopId, bool isVerified)
    {
        var shop = await _context.Shops.FirstOrDefaultAsync(s => s.Id == shopId);
        if (shop == null)
        {
            throw new KeyNotFoundException("Shop not found.");
        }

        shop.IsVerified = isVerified;
        shop.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    // Users

    public async Task<(List<AdminUserDto> items, int totalCount)> GetUsersAsync(string? role, int page, int pageSize)
    {
        var users = await _adminRepository.GetAllUsersAsync(role, page, pageSize);
        var total = await _adminRepository.GetAllUsersCountAsync(role);

        return (users.Select(MapUserToAdminDto).ToList(), total);
    }

    public async Task<AdminUserDto?> GetUserAsync(Guid id)
    {
        var user = await _adminRepository.GetUserByIdAsync(id);
        return user == null ? null : MapUserToAdminDto(user);
    }

    public async Task UpdateUserAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _adminRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.Role) && request.Role != user.Role)
        {
            // Prevent removing the last admin
            if (user.Role == "Admin" && request.Role != "Admin")
            {
                var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
                if (adminCount <= 1)
                {
                    throw new InvalidOperationException("Cannot change role of the last admin.");
                }
            }

            user.Role = request.Role;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteUserAsync(Guid id)
    {
        var user = await _adminRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        // Prevent deleting the last admin
        if (user.Role == "Admin")
        {
            var adminCount = await _context.Users.CountAsync(u => u.Role == "Admin");
            if (adminCount <= 1)
            {
                throw new InvalidOperationException("Cannot delete the last admin.");
            }
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    // Cities

    public async Task<List<AdminCityDto>> GetCitiesAsync()
    {
        var cities = await _adminRepository.GetAllCitiesAsync();
        return cities.Select(c => new AdminCityDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug
        }).ToList();
    }

    public async Task<AdminCityDto> CreateCityAsync(CreateCityRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Slug))
        {
            throw new ArgumentException("Name and Slug are required.");
        }

        var exists = await _context.Cities.AnyAsync(c => c.Slug == request.Slug);
        if (exists)
        {
            throw new InvalidOperationException("City slug already exists.");
        }

        var city = new City
        {
            Name = request.Name,
            Slug = request.Slug,
            CreatedAt = DateTime.UtcNow
        };

        _context.Cities.Add(city);
        await _context.SaveChangesAsync();

        return new AdminCityDto
        {
            Id = city.Id,
            Name = city.Name,
            Slug = city.Slug
        };
    }

    public async Task<AdminCityDto?> UpdateCityAsync(Guid id, CreateCityRequest request)
    {
        var city = await _adminRepository.GetCityByIdAsync(id);
        if (city == null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            city.Name = request.Name;
        }

        if (!string.IsNullOrWhiteSpace(request.Slug) && request.Slug != city.Slug)
        {
            var exists = await _context.Cities.AnyAsync(c => c.Slug == request.Slug && c.Id != id);
            if (exists)
            {
                throw new InvalidOperationException("City slug already exists.");
            }

            city.Slug = request.Slug;
        }

        await _context.SaveChangesAsync();

        return new AdminCityDto
        {
            Id = city.Id,
            Name = city.Name,
            Slug = city.Slug
        };
    }

    public async Task DeleteCityAsync(Guid id)
    {
        var city = await _adminRepository.GetCityByIdAsync(id);
        if (city == null)
        {
            throw new KeyNotFoundException("City not found.");
        }

        var hasShops = await _context.Shops.AnyAsync(s => s.CityId == id);
        if (hasShops)
        {
            throw new InvalidOperationException("Cannot delete city with active shops.");
        }

        _context.Cities.Remove(city);
        await _context.SaveChangesAsync();
    }

    // Tenants

    public async Task<List<AdminTenantDto>> GetTenantsAsync()
    {
        var tenants = await _adminRepository.GetAllTenantsAsync();
        return tenants.Select(t => new AdminTenantDto
        {
            Id = t.Id,
            Subdomain = t.Subdomain,
            CityId = t.CityId,
            CityName = t.City.Name,
            CitySlug = t.City.Slug,
            CreatedAt = t.CreatedAt
        }).ToList();
    }

    public async Task<AdminTenantDto> CreateTenantAsync(CreateTenantRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Subdomain))
        {
            throw new ArgumentException("Subdomain is required.");
        }

        var exists = await _context.Tenants.AnyAsync(t => t.Subdomain == request.Subdomain.ToLower());
        if (exists)
        {
            throw new InvalidOperationException("Subdomain already exists.");
        }

        var city = await _adminRepository.GetCityByIdAsync(request.CityId);
        if (city == null)
        {
            throw new KeyNotFoundException("City not found.");
        }

        var tenant = new Tenant
        {
            Subdomain = request.Subdomain.ToLower(),
            CityId = request.CityId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

        return new AdminTenantDto
        {
            Id = tenant.Id,
            Subdomain = tenant.Subdomain,
            CityId = tenant.CityId,
            CityName = city.Name,
            CitySlug = city.Slug,
            CreatedAt = tenant.CreatedAt
        };
    }

    public async Task<AdminTenantDto?> UpdateTenantAsync(Guid id, CreateTenantRequest request)
    {
        var tenant = await _adminRepository.GetTenantByIdAsync(id);
        if (tenant == null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.Subdomain) && request.Subdomain.ToLower() != tenant.Subdomain)
        {
            var exists = await _context.Tenants.AnyAsync(t => t.Subdomain == request.Subdomain.ToLower() && t.Id != id);
            if (exists)
            {
                throw new InvalidOperationException("Subdomain already exists.");
            }

            tenant.Subdomain = request.Subdomain.ToLower();
        }

        if (request.CityId != Guid.Empty && request.CityId != tenant.CityId)
        {
            var city = await _adminRepository.GetCityByIdAsync(request.CityId);
            if (city == null)
            {
                throw new KeyNotFoundException("City not found.");
            }

            tenant.CityId = request.CityId;
        }

        await _context.SaveChangesAsync();

        var updatedCity = await _adminRepository.GetCityByIdAsync(tenant.CityId);

        return new AdminTenantDto
        {
            Id = tenant.Id,
            Subdomain = tenant.Subdomain,
            CityId = tenant.CityId,
            CityName = updatedCity?.Name ?? string.Empty,
            CitySlug = updatedCity?.Slug ?? string.Empty,
            CreatedAt = tenant.CreatedAt
        };
    }

    public async Task DeleteTenantAsync(Guid id)
    {
        var tenant = await _adminRepository.GetTenantByIdAsync(id);
        if (tenant == null)
        {
            throw new KeyNotFoundException("Tenant not found.");
        }

        _context.Tenants.Remove(tenant);
        await _context.SaveChangesAsync();
    }

    // Dashboard

    public async Task<SystemStatisticsDto> GetSystemStatisticsAsync()
    {
        var stats = await _adminRepository.GetSystemStatisticsAsync();

        return new SystemStatisticsDto
        {
            TotalShops = stats.totalShops,
            VerifiedShops = stats.verifiedShops,
            TotalUsers = stats.totalUsers,
            TotalProducts = stats.totalProducts,
            TotalCities = stats.totalCities,
            TotalTenants = stats.totalTenants
        };
    }

    public async Task<DashboardDataDto> GetDashboardDataAsync()
    {
        var statistics = await GetSystemStatisticsAsync();

        // Pending shops (limit 10)
        var (pendingShops, _) = await GetPendingShopsAsync(1, 10);

        // Recent users (top 10 by CreatedAt)
        var recentUsers = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(10)
            .Include(u => u.OwnedShop)
            .ToListAsync();

        var recentUserDtos = recentUsers.Select(MapUserToAdminDto).ToList();

        return new DashboardDataDto
        {
            Statistics = statistics,
            PendingShops = pendingShops,
            RecentUsers = recentUserDtos
        };
    }

    // Mapping helpers

    private static AdminShopDto MapShopToAdminDto(Shop shop)
    {
        return new AdminShopDto
        {
            Id = shop.Id,
            Name = shop.Name,
            Slug = shop.Slug,
            LogoUrl = shop.LogoUrl,
            Address = shop.Address,
            Phone = shop.Phone,
            WhatsApp = shop.WhatsApp,
            IsVerified = shop.IsVerified,
            IsDeliveryAvailable = shop.IsDeliveryAvailable,
            Status = shop.Status,
            CityId = shop.CityId,
            CityName = shop.City?.Name ?? string.Empty,
            CitySlug = shop.City?.Slug ?? string.Empty,
            OwnerId = shop.OwnerId,
            OwnerEmail = shop.Owner?.Email,
            CreatedAt = shop.CreatedAt,
            UpdatedAt = shop.UpdatedAt
        };
    }

    private static AdminUserDto MapUserToAdminDto(User user)
    {
        return new AdminUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Role = user.Role,
            OwnedShopId = user.OwnedShop?.Id,
            OwnedShopName = user.OwnedShop?.Name,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}

