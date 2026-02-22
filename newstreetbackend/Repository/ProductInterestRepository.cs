using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public class ProductInterestRepository : IProductInterestRepository
{
    private readonly ApplicationDbContext _context;

    public ProductInterestRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProductInterest> CreateInterestAsync(ProductInterest interest)
    {
        _context.ProductInterests.Add(interest);
        await _context.SaveChangesAsync();
        return interest;
    }

    public async Task<int> GetInterestCountByProductIdAsync(Guid productId)
    {
        return await _context.ProductInterests
            .CountAsync(pi => pi.ProductId == productId);
    }

    public async Task<Dictionary<Guid, int>> GetInterestCountsByProductIdsAsync(List<Guid> productIds)
    {
        var counts = await _context.ProductInterests
            .Where(pi => productIds.Contains(pi.ProductId))
            .GroupBy(pi => pi.ProductId)
            .Select(g => new { ProductId = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = productIds.ToDictionary(id => id, id => 0);
        foreach (var count in counts)
        {
            result[count.ProductId] = count.Count;
        }

        return result;
    }

    public async Task<bool> HasUserExpressedInterestAsync(Guid productId, string? userEmail = null)
    {
        if (string.IsNullOrEmpty(userEmail))
        {
            return false; // Can't check without email
        }

        return await _context.ProductInterests
            .AnyAsync(pi => pi.ProductId == productId && pi.UserEmail == userEmail);
    }
}
