using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public interface IShopRepository
{
    Task<List<Shop>> GetAllShopsByCityIdAsync(Guid cityId);
    Task<Shop?> GetShopBySlugAsync(string slug, Guid cityId);
    Task<Shop?> GetShopByIdAsync(Guid id);
    Task<int> GetShopCountByCityIdAsync(Guid cityId);
    Task<Shop> CreateShopAsync(Shop shop);
    Task<Shop> UpdateShopAsync(Shop shop);
    Task<bool> DeleteShopAsync(Guid id);
}
