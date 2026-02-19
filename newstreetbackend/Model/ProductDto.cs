namespace newstreetbackend.Model;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? ImageUrl { get; set; }
    public int? Stock { get; set; }
    public Guid ShopId { get; set; }
    public string? ShopName { get; set; }
}
