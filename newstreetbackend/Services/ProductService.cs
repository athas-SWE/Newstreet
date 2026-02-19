using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Model;
using newstreetbackend.Repository;

namespace newstreetbackend.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ApplicationDbContext _context;

    public ProductService(IProductRepository productRepository, ApplicationDbContext context)
    {
        _productRepository = productRepository;
        _context = context;
    }

    public async Task<SearchResponse> SearchProductsAsync(string query, Guid cityId, int page = 1, int pageSize = 20)
    {
        var products = await _productRepository.SearchProductsAsync(query, cityId, page, pageSize);
        
        // Get total count for pagination
        var searchTerm = query.ToLower();
        var totalCount = await _context.Products
            .Include(p => p.Shop)
            .CountAsync(p => p.Shop != null && 
                            p.Shop.CityId == cityId && 
                            p.Shop.Status == "active" &&
                            (p.Name.ToLower().Contains(searchTerm) || 
                             (p.Description != null && p.Description.ToLower().Contains(searchTerm))));

        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            Stock = p.Stock,
            ShopId = p.ShopId,
            ShopName = p.Shop?.Name
        }).ToList();

        return new SearchResponse
        {
            Products = productDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PopularProductsResponse> GetPopularProductsAsync(Guid cityId, int count = 10)
    {
        var products = await _productRepository.GetPopularProductsAsync(cityId, count);
        
        var productDtos = products.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            Stock = p.Stock,
            ShopId = p.ShopId,
            ShopName = p.Shop?.Name
        }).ToList();

        // Common popular search terms (can be made dynamic based on actual search history)
        var popularSearches = new List<string> { "Milk", "Rice", "Sugar", "Soap", "Oil", "Bread", "Eggs", "Flour" };

        return new PopularProductsResponse
        {
            PopularSearches = popularSearches,
            PopularProducts = productDtos
        };
    }
}
