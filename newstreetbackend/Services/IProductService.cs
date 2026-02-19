using newstreetbackend.Model;

namespace newstreetbackend.Services;

public interface IProductService
{
    Task<SearchResponse> SearchProductsAsync(string query, Guid cityId, int page = 1, int pageSize = 20);
    Task<PopularProductsResponse> GetPopularProductsAsync(Guid cityId, int count = 10);
}
