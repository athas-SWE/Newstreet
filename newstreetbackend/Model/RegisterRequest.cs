namespace newstreetbackend.Model;

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "ShopOwner";
    
    // Shop details (required for ShopOwner registration)
    public string ShopName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? WhatsApp { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
