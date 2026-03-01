using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public class IndustryRepository : IIndustryRepository
{
    private readonly ApplicationDbContext _context;

    public IndustryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Industry>> GetAllIndustriesAsync()
    {
        return await _context.Industries
            .Where(i => i.IsActive)
            .OrderBy(i => i.Name)
            .ToListAsync();
    }

    public async Task<Industry?> GetIndustryByIdAsync(Guid id)
    {
        return await _context.Industries
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<Industry?> GetIndustryBySlugAsync(string slug)
    {
        return await _context.Industries
            .FirstOrDefaultAsync(i => i.Slug == slug);
    }

    public async Task<Industry> CreateIndustryAsync(Industry industry)
    {
        _context.Industries.Add(industry);
        await _context.SaveChangesAsync();
        return industry;
    }

    public async Task<Industry> UpdateIndustryAsync(Industry industry)
    {
        industry.UpdatedAt = DateTime.UtcNow;
        _context.Industries.Update(industry);
        await _context.SaveChangesAsync();
        return industry;
    }

    public async Task<bool> DeleteIndustryAsync(Guid id)
    {
        var industry = await _context.Industries.FindAsync(id);
        if (industry == null) return false;
        
        _context.Industries.Remove(industry);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IndustryExistsAsync(string name, string slug)
    {
        return await _context.Industries
            .AnyAsync(i => i.Name == name || i.Slug == slug);
    }
}
