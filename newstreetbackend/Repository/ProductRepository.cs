using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> SearchProductsAsync(string query, Guid cityId, int page = 1, int pageSize = 20)
    {
        var searchTerm = query.ToLower();
        
        return await _context.Products
            .Include(p => p.Shop)
            .ThenInclude(s => s!.City)
            .Where(p => p.Shop != null && 
                       p.Shop.CityId == cityId && 
                       p.Shop.Status == "active" &&
                       (p.Name.ToLower().Contains(searchTerm) || 
                        (p.Description != null && p.Description.ToLower().Contains(searchTerm))))
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<Product>> GetPopularProductsAsync(Guid cityId, int count = 10)
    {
        // Get popular products - can be based on most common product names or recently added
        // For now, returning most recently added products as popular
        return await _context.Products
            .Include(p => p.Shop)
            .ThenInclude(s => s!.City)
            .Where(p => p.Shop != null && 
                       p.Shop.CityId == cityId && 
                       p.Shop.Status == "active")
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(Guid id)
    {
        return await _context.Products
            .Include(p => p.Shop)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Product>> GetProductsByShopIdAsync(Guid shopId)
    {
        return await _context.Products
            .Where(p => p.ShopId == shopId)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> UpdateProductAsync(Product product)
    {
        product.UpdatedAt = DateTime.UtcNow;
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;
        
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }
}
