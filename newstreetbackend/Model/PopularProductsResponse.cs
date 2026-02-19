namespace newstreetbackend.Model;

public class PopularProductsResponse
{
    public List<string> PopularSearches { get; set; } = new();
    public List<ProductDto> PopularProducts { get; set; } = new();
}
