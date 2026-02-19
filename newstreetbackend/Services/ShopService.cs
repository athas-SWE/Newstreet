using newstreetbackend.Entities;
using newstreetbackend.Model;
using newstreetbackend.Repository;

namespace newstreetbackend.Services;

public class ShopService : IShopService
{
    private readonly IShopRepository _shopRepository;

    public ShopService(IShopRepository shopRepository)
    {
        _shopRepository = shopRepository;
    }

    public async Task<List<ShopDto>> GetShopsByCityIdAsync(Guid cityId)
    {
        var shops = await _shopRepository.GetAllShopsByCityIdAsync(cityId);
        return shops.Select(MapToDto).ToList();
    }

    public async Task<ShopDto?> GetShopBySlugAsync(string slug, Guid cityId)
    {
        var shop = await _shopRepository.GetShopBySlugAsync(slug, cityId);
        return shop == null ? null : MapToDto(shop);
    }

    public async Task<int> GetShopCountByCityIdAsync(Guid cityId)
    {
        return await _shopRepository.GetShopCountByCityIdAsync(cityId);
    }

    private static ShopDto MapToDto(Shop shop)
    {
        return new ShopDto
        {
            Id = shop.Id,
            Name = shop.Name,
            Slug = shop.Slug,
            LogoUrl = shop.LogoUrl,
            Address = shop.Address,
            Phone = shop.Phone,
            WhatsApp = shop.WhatsApp,
            IsVerified = shop.IsVerified,
            IsDeliveryAvailable = shop.IsDeliveryAvailable,
            Status = shop.Status,
            City = shop.City != null ? new CityDto
            {
                Id = shop.City.Id,
                Name = shop.City.Name,
                Slug = shop.City.Slug
            } : null
        };
    }
}
