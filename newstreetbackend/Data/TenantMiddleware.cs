using Microsoft.Extensions.Logging;
using newstreetbackend.Services;

namespace newstreetbackend.Data;

public class TenantMiddleware
{
    private readonly RequestDelegate _next;
    private const string TenantContextKey = "TenantCityId";
    private const string CitySubdomainHeader = "X-City-Subdomain";

    public TenantMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService, ILogger<TenantMiddleware> logger)
    {
        var host = context.Request.Host.Host;
        var subdomain = ExtractSubdomain(host);

        // If no subdomain in host, check for header (useful for development)
        if (string.IsNullOrEmpty(subdomain))
        {
            if (context.Request.Headers.TryGetValue(CitySubdomainHeader, out var headerSubdomain))
            {
                subdomain = headerSubdomain.ToString().ToLower();
                logger.LogInformation($"Using subdomain from header: {subdomain}");
            }
            else
            {
                logger.LogWarning($"No subdomain found in host ({host}) and no {CitySubdomainHeader} header present");
            }
        }

        if (!string.IsNullOrEmpty(subdomain))
        {
            var cityId = await tenantService.GetCityIdBySubdomainAsync(subdomain);
            if (cityId.HasValue)
            {
                context.Items[TenantContextKey] = cityId.Value;
                logger.LogDebug($"City ID {cityId.Value} set for subdomain: {subdomain}");
            }
            else
            {
                logger.LogWarning($"No city found for subdomain: {subdomain}");
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
