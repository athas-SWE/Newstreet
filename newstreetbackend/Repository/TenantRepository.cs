using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public class TenantRepository : ITenantRepository
{
    private readonly ApplicationDbContext _context;

    public TenantRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Tenant?> GetTenantBySubdomainAsync(string subdomain)
    {
        return await _context.Tenants
            .Include(t => t.City)
            .FirstOrDefaultAsync(t => t.Subdomain == subdomain.ToLower());
    }

    public async Task<City?> GetCityBySubdomainAsync(string subdomain)
    {
        var tenant = await GetTenantBySubdomainAsync(subdomain);
        return tenant?.City;
    }
}
