using newstreetbackend.Services;

namespace newstreetbackend.Data;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;
    private const string TenantContextKey = "TenantCityId";

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
    {
        var host = context.Request.Host.Host;
        var subdomain = ExtractSubdomain(host);

        if (!string.IsNullOrEmpty(subdomain))
        {
            var cityId = await tenantService.GetCityIdBySubdomainAsync(subdomain);
            if (cityId.HasValue)
            {
                context.Items[TenantContextKey] = cityId.Value;
            }
        }

        await _next(context);
    }

    private static string ExtractSubdomain(string host)
    {
        var parts = host.Split('.');
        if (parts.Length >= 3)
        {
            return parts[0].ToLower();
        }
        return string.Empty;
    }

    public static Guid? GetCityId(HttpContext context)
    {
        if (context.Items.TryGetValue(TenantContextKey, out var cityId) && cityId is Guid id)
        {
            return id;
        }
        return null;
    }
}
