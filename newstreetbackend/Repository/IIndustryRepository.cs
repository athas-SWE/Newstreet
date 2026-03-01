using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public interface IIndustryRepository
{
    Task<List<Industry>> GetAllIndustriesAsync();
    Task<Industry?> GetIndustryByIdAsync(Guid id);
    Task<Industry?> GetIndustryBySlugAsync(string slug);
    Task<Industry> CreateIndustryAsync(Industry industry);
    Task<Industry> UpdateIndustryAsync(Industry industry);
    Task<bool> DeleteIndustryAsync(Guid id);
    Task<bool> IndustryExistsAsync(string name, string slug);
}
