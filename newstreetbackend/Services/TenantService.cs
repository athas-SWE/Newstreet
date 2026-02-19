using newstreetbackend.Entities;
using newstreetbackend.Repository;

namespace newstreetbackend.Services;

public class TenantService : ITenantService
{
    private readonly ITenantRepository _tenantRepository;

    public TenantService(ITenantRepository tenantRepository)
    {
        _tenantRepository = tenantRepository;
    }

    public async Task<City?> GetCityBySubdomainAsync(string subdomain)
    {
        return await _tenantRepository.GetCityBySubdomainAsync(subdomain);
    }

    public async Task<Guid?> GetCityIdBySubdomainAsync(string subdomain)
    {
        var city = await GetCityBySubdomainAsync(subdomain);
        return city?.Id;
    }
}
