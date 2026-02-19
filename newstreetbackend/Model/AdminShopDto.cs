namespace newstreetbackend.Model;

public class AdminShopDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? WhatsApp { get; set; }
    public bool IsVerified { get; set; }
    public bool IsDeliveryAvailable { get; set; }
    public string Status { get; set; } = string.Empty;

    public Guid CityId { get; set; }
    public string CityName { get; set; } = string.Empty;
    public string CitySlug { get; set; } = string.Empty;

    public Guid? OwnerId { get; set; }
    public string? OwnerEmail { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

