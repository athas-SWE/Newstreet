using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public class ShopRepository : IShopRepository
{
    private readonly ApplicationDbContext _context;

    public ShopRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Shop>> GetAllShopsByCityIdAsync(Guid cityId)
    {
        return await _context.Shops
            .Include(s => s.City)
            .Where(s => s.CityId == cityId && s.Status == "active")
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<Shop?> GetShopBySlugAsync(string slug, Guid cityId)
    {
        return await _context.Shops
            .Include(s => s.City)
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Slug == slug && s.CityId == cityId);
    }

    public async Task<Shop?> GetShopByIdAsync(Guid id)
    {
        return await _context.Shops
            .Include(s => s.City)
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Shop> CreateShopAsync(Shop shop)
    {
        _context.Shops.Add(shop);
        await _context.SaveChangesAsync();
        return shop;
    }

    public async Task<Shop> UpdateShopAsync(Shop shop)
    {
        shop.UpdatedAt = DateTime.UtcNow;
        _context.Shops.Update(shop);
        await _context.SaveChangesAsync();
        return shop;
    }

    public async Task<int> GetShopCountByCityIdAsync(Guid cityId)
    {
        return await _context.Shops
            .CountAsync(s => s.CityId == cityId && s.Status == "active");
    }

    public async Task<bool> DeleteShopAsync(Guid id)
    {
        var shop = await _context.Shops.FindAsync(id);
        if (shop == null) return false;
        
        _context.Shops.Remove(shop);
        await _context.SaveChangesAsync();
        return true;
    }
}
