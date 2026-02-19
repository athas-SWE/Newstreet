using Microsoft.AspNetCore.Mvc;
using newstreetbackend.Data;
using newstreetbackend.Model;
using newstreetbackend.Services;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShopsController : ControllerBase
{
    private readonly IShopService _shopService;

    public ShopsController(IShopService shopService)
    {
        _shopService = shopService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ShopDto>>> GetShops()
    {
        var cityId = TenantMiddleware.GetCityId(HttpContext);
        if (!cityId.HasValue)
        {
            return BadRequest("Invalid subdomain or city not found");
        }

        var shops = await _shopService.GetShopsByCityIdAsync(cityId.Value);
        return Ok(shops);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ShopDto>> GetShop(string slug)
    {
        var cityId = TenantMiddleware.GetCityId(HttpContext);
        if (!cityId.HasValue)
        {
            return BadRequest("Invalid subdomain or city not found");
        }

        var shop = await _shopService.GetShopBySlugAsync(slug, cityId.Value);
        if (shop == null)
        {
            return NotFound();
        }

        return Ok(shop);
    }

    [HttpGet("count")]
    public async Task<ActionResult<int>> GetShopCount()
    {
        var cityId = TenantMiddleware.GetCityId(HttpContext);
        if (!cityId.HasValue)
        {
            return BadRequest("Invalid subdomain or city not found");
        }

        var count = await _shopService.GetShopCountByCityIdAsync(cityId.Value);
        return Ok(count);
    }
}
