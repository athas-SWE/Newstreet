using Microsoft.AspNetCore.Mvc;
using newstreetbackend.Model;
using newstreetbackend.Services;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductInterestController : ControllerBase
{
    private readonly IProductInterestService _interestService;

    public ProductInterestController(IProductInterestService interestService)
    {
        _interestService = interestService;
    }

    [HttpPost]
    public async Task<ActionResult<InterestResponse>> ExpressInterest([FromBody] ExpressInterestRequest request)
    {
        try
        {
            var response = await _interestService.ExpressInterestAsync(request);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    [HttpGet("product/{productId}/count")]
    public async Task<ActionResult<int>> GetInterestCount(Guid productId)
    {
        var count = await _interestService.GetInterestCountAsync(productId);
        return Ok(count);
    }

    [HttpPost("counts")]
    public async Task<ActionResult<Dictionary<Guid, int>>> GetInterestCounts([FromBody] List<Guid> productIds)
    {
        var counts = await _interestService.GetInterestCountsAsync(productIds);
        return Ok(counts);
    }
}
