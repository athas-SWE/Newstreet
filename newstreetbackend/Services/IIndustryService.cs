using newstreetbackend.Model;

namespace newstreetbackend.Services;

public interface IIndustryService
{
    Task<List<IndustryDto>> GetAllIndustriesAsync();
    Task<IndustryDto?> GetIndustryByIdAsync(Guid id);
    Task<IndustryDto?> GetIndustryBySlugAsync(string slug);
    Task<IndustryDto> CreateIndustryAsync(CreateIndustryRequest request);
    Task<IndustryDto?> UpdateIndustryAsync(Guid id, UpdateIndustryRequest request);
    Task<bool> DeleteIndustryAsync(Guid id);
}
