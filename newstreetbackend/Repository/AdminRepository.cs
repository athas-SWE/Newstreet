using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public class AdminRepository : IAdminRepository
{
    private readonly ApplicationDbContext _context;

    public AdminRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Shop>> GetAllShopsAsync(string? citySlug, string? status, bool? isVerified, int page, int pageSize)
    {
        var query = _context.Shops
            .Include(s => s.City)
            .Include(s => s.Owner)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(citySlug))
        {
            query = query.Where(s => s.City.Slug == citySlug);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(s => s.Status == status);
        }

        if (isVerified.HasValue)
        {
            query = query.Where(s => s.IsVerified == isVerified.Value);
        }

        return await query
            .OrderBy(s => s.City.Name)
            .ThenBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetAllShopsCountAsync(string? citySlug, string? status, bool? isVerified)
    {
        var query = _context.Shops
            .Include(s => s.City)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(citySlug))
        {
            query = query.Where(s => s.City.Slug == citySlug);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(s => s.Status == status);
        }

        if (isVerified.HasValue)
        {
            query = query.Where(s => s.IsVerified == isVerified.Value);
        }

        return await query.CountAsync();
    }

    public async Task<List<Shop>> GetShopsPendingVerificationAsync(int page, int pageSize)
    {
        return await _context.Shops
            .Include(s => s.City)
            .Where(s => !s.IsVerified && s.Status == "active")
            .OrderBy(s => s.City.Name)
            .ThenBy(s => s.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetShopsPendingVerificationCountAsync()
    {
        return await _context.Shops
            .CountAsync(s => !s.IsVerified && s.Status == "active");
    }

    public async Task<List<User>> GetAllUsersAsync(string? role, int page, int pageSize)
    {
        var query = _context.Users
            .Include(u => u.OwnedShop)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(role))
        {
            query = query.Where(u => u.Role == role);
        }

        return await query
            .OrderBy(u => u.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetAllUsersCountAsync(string? role)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(role))
        {
            query = query.Where(u => u.Role == role);
        }

        return await query.CountAsync();
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.OwnedShop)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<List<City>> GetAllCitiesAsync()
    {
        return await _context.Cities
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<City?> GetCityByIdAsync(Guid id)
    {
        return await _context.Cities.FindAsync(id);
    }

    public async Task<List<Tenant>> GetAllTenantsAsync()
    {
        return await _context.Tenants
            .Include(t => t.City)
            .OrderBy(t => t.Subdomain)
            .ToListAsync();
    }

    public async Task<Tenant?> GetTenantByIdAsync(Guid id)
    {
        return await _context.Tenants
            .Include(t => t.City)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<(int totalShops, int verifiedShops, int totalUsers, int totalProducts, int totalCities, int totalTenants)>
        GetSystemStatisticsAsync()
    {
        var totalShops = await _context.Shops.CountAsync();
        var verifiedShops = await _context.Shops.CountAsync(s => s.IsVerified);
        var totalUsers = await _context.Users.CountAsync();
        var totalProducts = await _context.Products.CountAsync();
        var totalCities = await _context.Cities.CountAsync();
        var totalTenants = await _context.Tenants.CountAsync();

        return (totalShops, verifiedShops, totalUsers, totalProducts, totalCities, totalTenants);
    }
}

