namespace newstreetbackend.Entities;

public class Tenant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Subdomain { get; set; } = string.Empty;
    public Guid CityId { get; set; }
    public string? Settings { get; set; } // JSON string for additional settings
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public City City { get; set; } = null!;
}
