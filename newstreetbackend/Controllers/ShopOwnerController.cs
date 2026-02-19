using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;
using newstreetbackend.Model;
using newstreetbackend.Repository;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ShopOwner,Admin")]
public class ShopOwnerController : ControllerBase
{
    private readonly IShopRepository _shopRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;
    private readonly ApplicationDbContext _context;

    public ShopOwnerController(
        IShopRepository shopRepository, 
        IProductRepository productRepository,
        IUserRepository userRepository,
        ApplicationDbContext context)
    {
        _shopRepository = shopRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
        _context = context;
    }

    [HttpGet("shop")]
    public async Task<ActionResult<ShopDto>> GetMyShop()
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var user = await _userRepository.GetUserByEmailAsync(userEmail);
        if (user == null || user.OwnedShop == null)
        {
            return NotFound("Shop not found");
        }

        var shop = user.OwnedShop;

        var shopDto = new ShopDto
        {
            Id = shop.Id,
            Name = shop.Name,
            Slug = shop.Slug,
            LogoUrl = shop.LogoUrl,
            Address = shop.Address,
            Phone = shop.Phone,
            WhatsApp = shop.WhatsApp,
            IsVerified = shop.IsVerified,
            IsDeliveryAvailable = shop.IsDeliveryAvailable,
            Status = shop.Status
        };

        return Ok(shopDto);
    }

    [HttpPut("shop")]
    public async Task<ActionResult<ShopDto>> UpdateShop([FromBody] ShopDto shopDto)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var user = await _userRepository.GetUserByEmailAsync(userEmail);
        if (user == null || user.OwnedShop == null)
        {
            return NotFound("Shop not found");
        }

        var shop = user.OwnedShop;
        if (shop.Id != shopDto.Id)
        {
            return Forbid();
        }

        shop.Name = shopDto.Name;
        shop.Address = shopDto.Address;
        shop.Phone = shopDto.Phone;
        shop.WhatsApp = shopDto.WhatsApp;
        shop.LogoUrl = shopDto.LogoUrl;
        shop.IsDeliveryAvailable = shopDto.IsDeliveryAvailable;

        await _shopRepository.UpdateShopAsync(shop);
        return Ok(shopDto);
    }

    [HttpGet("products")]
    public async Task<ActionResult<List<ProductDto>>> GetMyProducts()
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var user = await _userRepository.GetUserByEmailAsync(userEmail);
        if (user == null || user.OwnedShop == null)
        {
            return NotFound("Shop not found");
        }

        var shop = user.OwnedShop;

        var products = await _productRepository.GetProductsByShopIdAsync(shop.Id);
        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            Stock = p.Stock,
            ShopId = p.ShopId
        }).ToList();

        return Ok(productDtos);
    }

    [HttpPost("products")]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] ProductDto productDto)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var user = await _userRepository.GetUserByEmailAsync(userEmail);
        if (user == null || user.OwnedShop == null)
        {
            return NotFound("Shop not found");
        }

        var shop = user.OwnedShop;

        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            ImageUrl = productDto.ImageUrl,
            Stock = productDto.Stock,
            ShopId = shop.Id
        };

        await _productRepository.CreateProductAsync(product);
        productDto.Id = product.Id;
        return Ok(productDto);
    }

    [HttpPut("products/{id}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(Guid id, [FromBody] ProductDto productDto)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var product = await _productRepository.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        var user = await _userRepository.GetUserByEmailAsync(userEmail);
        if (user == null || user.OwnedShop == null || product.ShopId != user.OwnedShop.Id)
        {
            return Forbid();
        }

        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.ImageUrl = productDto.ImageUrl;
        product.Stock = productDto.Stock;

        await _productRepository.UpdateProductAsync(product);
        return Ok(productDto);
    }

    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var product = await _productRepository.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        var user = await _userRepository.GetUserByEmailAsync(userEmail);
        if (user == null || user.OwnedShop == null || product.ShopId != user.OwnedShop.Id)
        {
            return Forbid();
        }

        await _productRepository.DeleteProductAsync(id);
        return NoContent();
    }
}
