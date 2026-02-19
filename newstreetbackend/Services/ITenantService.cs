using newstreetbackend.Entities;

namespace newstreetbackend.Services;

public interface ITenantService
{
    Task<City?> GetCityBySubdomainAsync(string subdomain);
    Task<Guid?> GetCityIdBySubdomainAsync(string subdomain);
}
