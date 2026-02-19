using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public interface ITenantRepository
{
    Task<Tenant?> GetTenantBySubdomainAsync(string subdomain);
    Task<City?> GetCityBySubdomainAsync(string subdomain);
}
