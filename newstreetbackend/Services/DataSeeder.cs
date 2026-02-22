using Microsoft.EntityFrameworkCore;
using newstreetbackend.Dbcontext;
using newstreetbackend.Entities;

namespace newstreetbackend.Services;

public class DataSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DataSeeder> _logger;

    public DataSeeder(ApplicationDbContext context, ILogger<DataSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            // Ensure database is created
            await _context.Database.EnsureCreatedAsync();

            // Seed Cities
            await SeedCitiesAsync();

            // Seed Tenants
            await SeedTenantsAsync();

            // Seed Admin User
            await SeedAdminUserAsync();

            // Seed Sample Shops and Products
            await SeedSampleShopsAndProductsAsync();

            _logger.LogInformation("Database seeded successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    private async Task SeedCitiesAsync()
    {
        if (await _context.Cities.AnyAsync())
        {
            _logger.LogInformation("Cities already exist, skipping seed");
            return;
        }

        var cities = new List<City>
        {
            new City
            {
                Id = Guid.NewGuid(),
                Name = "Colombo",
                Slug = "colombo",
                CreatedAt = DateTime.UtcNow
            },
            new City
            {
                Id = Guid.NewGuid(),
                Name = "Kandy",
                Slug = "kandy",
                CreatedAt = DateTime.UtcNow
            },
            new City
            {
                Id = Guid.NewGuid(),
                Name = "Galle",
                Slug = "galle",
                CreatedAt = DateTime.UtcNow
            },
            new City
            {
                Id = Guid.NewGuid(),
                Name = "Jaffna",
                Slug = "jaffna",
                CreatedAt = DateTime.UtcNow
            },
            new City
            {
                Id = Guid.NewGuid(),
                Name = "Negombo",
                Slug = "negombo",
                CreatedAt = DateTime.UtcNow
            }
        };

        await _context.Cities.AddRangeAsync(cities);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Seeded {cities.Count} cities");
    }

    private async Task SeedTenantsAsync()
    {
        if (await _context.Tenants.AnyAsync())
        {
            _logger.LogInformation("Tenants already exist, skipping seed");
            return;
        }

        var cities = await _context.Cities.ToListAsync();
        var tenants = new List<Tenant>();

        foreach (var city in cities)
        {
            tenants.Add(new Tenant
            {
                Id = Guid.NewGuid(),
                Subdomain = city.Slug,
                CityId = city.Id,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.Tenants.AddRangeAsync(tenants);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Seeded {tenants.Count} tenants");
    }

    private async Task SeedAdminUserAsync()
    {
        if (await _context.Users.AnyAsync(u => u.Role == "Admin"))
        {
            _logger.LogInformation("Admin user already exists, skipping seed");
            return;
        }

        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@streetmain.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(adminUser);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded admin user: admin@streetmain.com / Admin@123");
    }

    private async Task SeedSampleShopsAndProductsAsync()
    {
        if (await _context.Shops.AnyAsync())
        {
            _logger.LogInformation("Shops already exist, skipping seed");
            return;
        }

        var cities = await _context.Cities.ToListAsync();
        if (!cities.Any())
        {
            _logger.LogWarning("No cities found, cannot seed shops");
            return;
        }

        var colombo = cities.FirstOrDefault(c => c.Slug == "colombo");
        if (colombo == null)
        {
            _logger.LogWarning("Colombo city not found, skipping shop seed");
            return;
        }

        // Create sample shop owner user
        var shopOwner = new User
        {
            Id = Guid.NewGuid(),
            Email = "shopowner@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ShopOwner@123"),
            Role = "ShopOwner",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(shopOwner);
        await _context.SaveChangesAsync();

        // Create sample shop
        var shop = new Shop
        {
            Id = Guid.NewGuid(),
            Name = "City Supermarket",
            Slug = "city-supermarket",
            Address = "123 Main Street, Colombo 05",
            Phone = "+94112345678",
            WhatsApp = "+94112345678",
            Latitude = 6.9271,
            Longitude = 79.8612,
            CityId = colombo.Id,
            OwnerId = shopOwner.Id,
            IsVerified = true,
            IsDeliveryAvailable = true,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.Shops.AddAsync(shop);
        await _context.SaveChangesAsync();

        // Create sample products
        var products = new List<Product>
        {
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Fresh Milk 1L",
                Description = "Fresh whole milk",
                Price = 250.00m,
                Stock = 50,
                ShopId = shop.Id,
                ImageUrl = "https://via.placeholder.com/300?text=Milk",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "White Bread",
                Description = "Fresh white bread loaf",
                Price = 120.00m,
                Stock = 30,
                ShopId = shop.Id,
                ImageUrl = "https://via.placeholder.com/300?text=Bread",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Eggs (Dozen)",
                Description = "Fresh chicken eggs - 12 pieces",
                Price = 350.00m,
                Stock = 25,
                ShopId = shop.Id,
                ImageUrl = "https://via.placeholder.com/300?text=Eggs",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Rice 5kg",
                Description = "Premium white rice 5kg bag",
                Price = 850.00m,
                Stock = 20,
                ShopId = shop.Id,
                ImageUrl = "https://via.placeholder.com/300?text=Rice",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Cooking Oil 1L",
                Description = "Vegetable cooking oil",
                Price = 450.00m,
                Stock = 40,
                ShopId = shop.Id,
                ImageUrl = "https://via.placeholder.com/300?text=Oil",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _context.Products.AddRangeAsync(products);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Seeded 1 shop with {products.Count} products");
    }
}
