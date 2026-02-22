namespace newstreetbackend.Entities;

public class ProductInterest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public string? UserEmail { get; set; } // Optional - for tracking if user is logged in
    public string? UserName { get; set; } // Optional - user's name if provided
    public string? UserPhone { get; set; } // Optional - user's phone if provided
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public Product Product { get; set; } = null!;
}
