using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using newstreetbackend.Model;
using newstreetbackend.Services;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IndustriesController : ControllerBase
{
    private readonly IIndustryService _industryService;

    public IndustriesController(IIndustryService industryService)
    {
        _industryService = industryService;
    }

    [HttpGet]
    public async Task<ActionResult<List<IndustryDto>>> GetIndustries()
    {
        var industries = await _industryService.GetAllIndustriesAsync();
        return Ok(industries);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IndustryDto>> GetIndustry(Guid id)
    {
        var industry = await _industryService.GetIndustryByIdAsync(id);
        if (industry == null)
        {
            return NotFound();
        }
        return Ok(industry);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<IndustryDto>> GetIndustryBySlug(string slug)
    {
        var industry = await _industryService.GetIndustryBySlugAsync(slug);
        if (industry == null)
        {
            return NotFound();
        }
        return Ok(industry);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IndustryDto>> CreateIndustry([FromBody] CreateIndustryRequest request)
    {
        try
        {
            var industry = await _industryService.CreateIndustryAsync(request);
            return CreatedAtAction(nameof(GetIndustry), new { id = industry.Id }, industry);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IndustryDto>> UpdateIndustry(Guid id, [FromBody] UpdateIndustryRequest request)
    {
        try
        {
            var industry = await _industryService.UpdateIndustryAsync(id, request);
            if (industry == null)
            {
                return NotFound();
            }
            return Ok(industry);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteIndustry(Guid id)
    {
        var result = await _industryService.DeleteIndustryAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
