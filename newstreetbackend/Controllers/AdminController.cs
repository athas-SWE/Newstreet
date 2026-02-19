using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using newstreetbackend.Model;
using newstreetbackend.Services;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    // Shop Management

    [HttpGet("shops")]
    public async Task<ActionResult<object>> GetShops(
        [FromQuery] string? citySlug,
        [FromQuery] string? status,
        [FromQuery] bool? isVerified,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _adminService.GetShopsAsync(citySlug, status, isVerified, page, pageSize);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("shops/pending")]
    public async Task<ActionResult<object>> GetPendingShops(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _adminService.GetPendingShopsAsync(page, pageSize);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpPut("shops/{id:guid}/verify")]
    public async Task<IActionResult> VerifyShop(Guid id, [FromBody] VerifyShopRequest request)
    {
        try
        {
            await _adminService.VerifyShopAsync(id, request.IsVerified);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // User Management

    [HttpGet("users")]
    public async Task<ActionResult<object>> GetUsers(
        [FromQuery] string? role,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var (items, total) = await _adminService.GetUsersAsync(role, page, pageSize);
        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("users/{id:guid}")]
    public async Task<ActionResult<AdminUserDto>> GetUser(Guid id)
    {
        var user = await _adminService.GetUserAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPut("users/{id:guid}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            await _adminService.UpdateUserAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            await _adminService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // City Management

    [HttpGet("cities")]
    public async Task<ActionResult<List<AdminCityDto>>> GetCities()
    {
        var cities = await _adminService.GetCitiesAsync();
        return Ok(cities);
    }

    [HttpPost("cities")]
    public async Task<ActionResult<AdminCityDto>> CreateCity([FromBody] CreateCityRequest request)
    {
        try
        {
            var city = await _adminService.CreateCityAsync(request);
            return CreatedAtAction(nameof(GetCities), new { id = city.Id }, city);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("cities/{id:guid}")]
    public async Task<ActionResult<AdminCityDto>> UpdateCity(Guid id, [FromBody] CreateCityRequest request)
    {
        try
        {
            var city = await _adminService.UpdateCityAsync(id, request);
            if (city == null)
            {
                return NotFound();
            }

            return Ok(city);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("cities/{id:guid}")]
    public async Task<IActionResult> DeleteCity(Guid id)
    {
        try
        {
            await _adminService.DeleteCityAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Tenant Management

    [HttpGet("tenants")]
    public async Task<ActionResult<List<AdminTenantDto>>> GetTenants()
    {
        var tenants = await _adminService.GetTenantsAsync();
        return Ok(tenants);
    }

    [HttpPost("tenants")]
    public async Task<ActionResult<AdminTenantDto>> CreateTenant([FromBody] CreateTenantRequest request)
    {
        try
        {
            var tenant = await _adminService.CreateTenantAsync(request);
            return CreatedAtAction(nameof(GetTenants), new { id = tenant.Id }, tenant);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("tenants/{id:guid}")]
    public async Task<ActionResult<AdminTenantDto>> UpdateTenant(Guid id, [FromBody] CreateTenantRequest request)
    {
        try
        {
            var tenant = await _adminService.UpdateTenantAsync(id, request);
            if (tenant == null)
            {
                return NotFound();
            }

            return Ok(tenant);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("tenants/{id:guid}")]
    public async Task<IActionResult> DeleteTenant(Guid id)
    {
        try
        {
            await _adminService.DeleteTenantAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // Dashboard & Statistics

    [HttpGet("statistics")]
    public async Task<ActionResult<SystemStatisticsDto>> GetStatistics()
    {
        var stats = await _adminService.GetSystemStatisticsAsync();
        return Ok(stats);
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardDataDto>> GetDashboard()
    {
        var dashboard = await _adminService.GetDashboardDataAsync();
        return Ok(dashboard);
    }
}

