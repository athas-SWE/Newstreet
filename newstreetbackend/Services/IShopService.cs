using newstreetbackend.Model;

namespace newstreetbackend.Services;

public interface IShopService
{
    Task<List<ShopDto>> GetShopsByCityIdAsync(Guid cityId);
    Task<ShopDto?> GetShopBySlugAsync(string slug, Guid cityId);
    Task<int> GetShopCountByCityIdAsync(Guid cityId);
}
