using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public interface IProductRepository
{
    Task<List<Product>> SearchProductsAsync(string query, Guid cityId, int page = 1, int pageSize = 20);
    Task<List<Product>> GetPopularProductsAsync(Guid cityId, int count = 10);
    Task<Product?> GetProductByIdAsync(Guid id);
    Task<List<Product>> GetProductsByShopIdAsync(Guid shopId);
    Task<Product> CreateProductAsync(Product product);
    Task<Product> UpdateProductAsync(Product product);
    Task<bool> DeleteProductAsync(Guid id);
}
