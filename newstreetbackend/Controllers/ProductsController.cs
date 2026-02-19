using Microsoft.AspNetCore.Mvc;
using newstreetbackend.Data;
using newstreetbackend.Model;
using newstreetbackend.Services;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("search")]
    public async Task<ActionResult<SearchResponse>> SearchProducts([FromQuery] string q, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return BadRequest("Search query is required");
        }

        var cityId = TenantMiddleware.GetCityId(HttpContext);
        if (!cityId.HasValue)
        {
            return BadRequest("Invalid subdomain or city not found");
        }

        var result = await _productService.SearchProductsAsync(q, cityId.Value, page, pageSize);
        return Ok(result);
    }

    [HttpGet("popular")]
    public async Task<ActionResult<PopularProductsResponse>> GetPopularProducts([FromQuery] int count = 10)
    {
        var cityId = TenantMiddleware.GetCityId(HttpContext);
        if (!cityId.HasValue)
        {
            return BadRequest("Invalid subdomain or city not found");
        }

        var result = await _productService.GetPopularProductsAsync(cityId.Value, count);
        return Ok(result);
    }
}
