using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public interface IAdminRepository
{
    // Shops
    Task<List<Shop>> GetAllShopsAsync(string? citySlug, string? status, bool? isVerified, int page, int pageSize);
    Task<int> GetAllShopsCountAsync(string? citySlug, string? status, bool? isVerified);
    Task<List<Shop>> GetShopsPendingVerificationAsync(int page, int pageSize);
    Task<int> GetShopsPendingVerificationCountAsync();

    // Users
    Task<List<User>> GetAllUsersAsync(string? role, int page, int pageSize);
    Task<int> GetAllUsersCountAsync(string? role);
    Task<User?> GetUserByIdAsync(Guid id);

    // Cities & Tenants
    Task<List<City>> GetAllCitiesAsync();
    Task<City?> GetCityByIdAsync(Guid id);
    Task<List<Tenant>> GetAllTenantsAsync();
    Task<Tenant?> GetTenantByIdAsync(Guid id);

    // System statistics
    Task<(int totalShops, int verifiedShops, int totalUsers, int totalProducts, int totalCities, int totalTenants)>
        GetSystemStatisticsAsync();
}

