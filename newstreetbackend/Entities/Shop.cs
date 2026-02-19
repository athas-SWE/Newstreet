namespace newstreetbackend.Entities;

public class Shop
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? WhatsApp { get; set; }
    public Guid CityId { get; set; }
    public bool IsVerified { get; set; } = false;
    public bool IsDeliveryAvailable { get; set; } = false;
    public string Status { get; set; } = "active"; // active, inactive, suspended
    public Guid? OwnerId { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public City City { get; set; } = null!;
    public User? Owner { get; set; }
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
