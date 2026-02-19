namespace newstreetbackend.Model;

public class AdminTenantDto
{
    public Guid Id { get; set; }
    public string Subdomain { get; set; } = string.Empty;

    public Guid CityId { get; set; }
    public string CityName { get; set; } = string.Empty;
    public string CitySlug { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}

