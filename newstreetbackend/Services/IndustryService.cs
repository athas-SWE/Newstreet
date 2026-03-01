using newstreetbackend.Entities;
using newstreetbackend.Model;
using newstreetbackend.Repository;
using System.Text.RegularExpressions;

namespace newstreetbackend.Services;

public class IndustryService : IIndustryService
{
    private readonly IIndustryRepository _industryRepository;

    public IndustryService(IIndustryRepository industryRepository)
    {
        _industryRepository = industryRepository;
    }

    public async Task<List<IndustryDto>> GetAllIndustriesAsync()
    {
        var industries = await _industryRepository.GetAllIndustriesAsync();
        return industries.Select(MapToDto).ToList();
    }

    public async Task<IndustryDto?> GetIndustryByIdAsync(Guid id)
    {
        var industry = await _industryRepository.GetIndustryByIdAsync(id);
        return industry == null ? null : MapToDto(industry);
    }

    public async Task<IndustryDto?> GetIndustryBySlugAsync(string slug)
    {
        var industry = await _industryRepository.GetIndustryBySlugAsync(slug);
        return industry == null ? null : MapToDto(industry);
    }

    public async Task<IndustryDto> CreateIndustryAsync(CreateIndustryRequest request)
    {
        var slug = string.IsNullOrWhiteSpace(request.Slug) 
            ? GenerateSlug(request.Name) 
            : request.Slug;

        // Check if industry with same name or slug already exists
        if (await _industryRepository.IndustryExistsAsync(request.Name, slug))
        {
            throw new InvalidOperationException("An industry with this name or slug already exists.");
        }

        var industry = new Industry
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            IconUrl = request.IconUrl,
            IsActive = request.IsActive ?? true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var createdIndustry = await _industryRepository.CreateIndustryAsync(industry);
        return MapToDto(createdIndustry);
    }

    public async Task<IndustryDto?> UpdateIndustryAsync(Guid id, UpdateIndustryRequest request)
    {
        var industry = await _industryRepository.GetIndustryByIdAsync(id);
        if (industry == null) return null;

        var slug = string.IsNullOrWhiteSpace(request.Slug) 
            ? GenerateSlug(request.Name) 
            : request.Slug;

        // Check if another industry with same name or slug exists
        var existing = await _industryRepository.GetIndustryBySlugAsync(slug);
        if (existing != null && existing.Id != id)
        {
            throw new InvalidOperationException("An industry with this name or slug already exists.");
        }

        industry.Name = request.Name;
        industry.Slug = slug;
        industry.Description = request.Description;
        industry.IconUrl = request.IconUrl;
        if (request.IsActive.HasValue)
        {
            industry.IsActive = request.IsActive.Value;
        }
        industry.UpdatedAt = DateTime.UtcNow;

        var updatedIndustry = await _industryRepository.UpdateIndustryAsync(industry);
        return MapToDto(updatedIndustry);
    }

    public async Task<bool> DeleteIndustryAsync(Guid id)
    {
        return await _industryRepository.DeleteIndustryAsync(id);
    }

    private static IndustryDto MapToDto(Industry industry)
    {
        return new IndustryDto
        {
            Id = industry.Id,
            Name = industry.Name,
            Slug = industry.Slug,
            Description = industry.Description,
            IconUrl = industry.IconUrl,
            IsActive = industry.IsActive,
            CreatedAt = industry.CreatedAt,
            UpdatedAt = industry.UpdatedAt
        };
    }

    private static string GenerateSlug(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // Convert to lowercase
        var slug = input.ToLowerInvariant();

        // Replace spaces and special characters with hyphens
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", " ").Trim();
        slug = Regex.Replace(slug, @"\s", "-");

        // Remove multiple consecutive hyphens
        slug = Regex.Replace(slug, @"-+", "-");

        return slug;
    }
}
