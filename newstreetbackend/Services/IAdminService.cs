using newstreetbackend.Model;

namespace newstreetbackend.Services;

public interface IAdminService
{
    // Shops
    Task<(List<AdminShopDto> items, int totalCount)> GetShopsAsync(
        string? citySlug,
        string? status,
        bool? isVerified,
        int page,
        int pageSize);

    Task<(List<AdminShopDto> items, int totalCount)> GetPendingShopsAsync(
        int page,
        int pageSize);

    Task VerifyShopAsync(Guid shopId, bool isVerified);

    // Users
    Task<(List<AdminUserDto> items, int totalCount)> GetUsersAsync(
        string? role,
        int page,
        int pageSize);

    Task<AdminUserDto?> GetUserAsync(Guid id);

    Task UpdateUserAsync(Guid id, UpdateUserRequest request);

    Task DeleteUserAsync(Guid id);

    // Cities
    Task<List<AdminCityDto>> GetCitiesAsync();
    Task<AdminCityDto> CreateCityAsync(CreateCityRequest request);
    Task<AdminCityDto?> UpdateCityAsync(Guid id, CreateCityRequest request);
    Task DeleteCityAsync(Guid id);

    // Tenants
    Task<List<AdminTenantDto>> GetTenantsAsync();
    Task<AdminTenantDto> CreateTenantAsync(CreateTenantRequest request);
    Task<AdminTenantDto?> UpdateTenantAsync(Guid id, CreateTenantRequest request);
    Task DeleteTenantAsync(Guid id);

    // Dashboard
    Task<SystemStatisticsDto> GetSystemStatisticsAsync();
    Task<DashboardDataDto> GetDashboardDataAsync();
}

