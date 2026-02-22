using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using newstreetbackend.Services;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ImageUploadController : ControllerBase
{
    private readonly IImageUploadService _imageUploadService;
    private readonly ILogger<ImageUploadController> _logger;

    public ImageUploadController(IImageUploadService imageUploadService, ILogger<ImageUploadController> logger)
    {
        _imageUploadService = imageUploadService;
        _logger = logger;
    }

    [HttpPost("product")]
    public async Task<ActionResult<ImageUploadResponse>> UploadProductImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Invalid file type. Allowed types: jpg, jpeg, png, gif, webp" });
        }

        // Validate file size (max 10MB)
        if (file.Length > 10 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 10MB limit" });
        }

        try
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0; // Reset position to beginning
            
            var imageUrl = await _imageUploadService.UploadImageAsync(stream, file.FileName, "products");
            return Ok(new ImageUploadResponse { ImageUrl = imageUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading product image: {Message}", ex.Message);
            _logger.LogError(ex, "Stack trace: {StackTrace}", ex.StackTrace);
            return StatusCode(500, new { message = "Error uploading image", error = ex.Message });
        }
    }

    [HttpPost("shop")]
    public async Task<ActionResult<ImageUploadResponse>> UploadShopImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { message = "Invalid file type. Allowed types: jpg, jpeg, png, gif, webp" });
        }

        // Validate file size (max 10MB)
        if (file.Length > 10 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 10MB limit" });
        }

        try
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0; // Reset position to beginning
            
            var imageUrl = await _imageUploadService.UploadImageAsync(stream, file.FileName, "shops");
            return Ok(new ImageUploadResponse { ImageUrl = imageUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading shop image: {Message}", ex.Message);
            _logger.LogError(ex, "Stack trace: {StackTrace}", ex.StackTrace);
            return StatusCode(500, new { message = "Error uploading image", error = ex.Message });
        }
    }
}

public class ImageUploadResponse
{
    public string ImageUrl { get; set; } = string.Empty;
}
