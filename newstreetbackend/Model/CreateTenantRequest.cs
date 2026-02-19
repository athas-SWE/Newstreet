namespace newstreetbackend.Model;

public class CreateTenantRequest
{
    public string Subdomain { get; set; } = string.Empty;
    public Guid CityId { get; set; }
}

