namespace newstreetbackend.Entities;

public class City
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<Shop> Shops { get; set; } = new List<Shop>();
    public ICollection<Tenant> Tenants { get; set; } = new List<Tenant>();
}
