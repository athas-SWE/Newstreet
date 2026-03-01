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

            // Seed Industries
            await SeedIndustriesAsync();

            // Seed Tenants
            await SeedTenantsAsync();

            // Seed Admin User
            await SeedAdminUserAsync();

            // Seed Sample Shops and Products
            await SeedSampleShopsAndProductsAsync();

            // Update existing shops without industries
            await UpdateShopsWithoutIndustriesAsync();

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

    private async Task SeedIndustriesAsync()
    {
        if (await _context.Industries.AnyAsync())
        {
            _logger.LogInformation("Industries already exist, skipping seed");
            return;
        }

        var industries = new List<Industry>
        {
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Grocery & Supermarket",
                Slug = "grocery-supermarket",
                Description = "Food items, beverages, household essentials, and daily necessities",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Electronics & Appliances",
                Slug = "electronics-appliances",
                Description = "Electronic devices, home appliances, and tech accessories",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Fashion & Clothing",
                Slug = "fashion-clothing",
                Description = "Clothing, accessories, footwear, and fashion items",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Pharmacy & Health",
                Slug = "pharmacy-health",
                Description = "Medicines, health products, personal care, and wellness items",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Restaurant & Food",
                Slug = "restaurant-food",
                Description = "Restaurants, cafes, food delivery, and catering services",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Beauty & Cosmetics",
                Slug = "beauty-cosmetics",
                Description = "Beauty products, cosmetics, skincare, and personal grooming",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Home & Garden",
                Slug = "home-garden",
                Description = "Home improvement, furniture, garden supplies, and decor",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Sports & Fitness",
                Slug = "sports-fitness",
                Description = "Sports equipment, fitness gear, and athletic wear",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Books & Stationery",
                Slug = "books-stationery",
                Description = "Books, magazines, office supplies, and stationery items",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Automotive",
                Slug = "automotive",
                Description = "Car parts, accessories, tires, and automotive services",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Jewelry & Watches",
                Slug = "jewelry-watches",
                Description = "Jewelry, watches, precious metals, and accessories",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Toys & Games",
                Slug = "toys-games",
                Description = "Toys, games, puzzles, and children's entertainment",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Pet Supplies",
                Slug = "pet-supplies",
                Description = "Pet food, accessories, toys, and care products",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "Hardware & Tools",
                Slug = "hardware-tools",
                Description = "Hardware, tools, building materials, and DIY supplies",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Industry
            {
                Id = Guid.NewGuid(),
                Name = "General Store",
                Slug = "general-store",
                Description = "Multi-category store with various products and services",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _context.Industries.AddRangeAsync(industries);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Seeded {industries.Count} industries");
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

        // Get Grocery & Supermarket industry
        var groceryIndustry = await _context.Industries.FirstOrDefaultAsync(i => i.Slug == "grocery-supermarket");

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
            IndustryId = groceryIndustry?.Id,
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
                ImageUrl1 = "https://via.placeholder.com/300?text=Milk",
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
                ImageUrl1 = "https://via.placeholder.com/300?text=Bread",
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
                ImageUrl1 = "https://via.placeholder.com/300?text=Eggs",
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
                ImageUrl1 = "https://via.placeholder.com/300?text=Rice",
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
                ImageUrl1 = "https://via.placeholder.com/300?text=Oil",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await _context.Products.AddRangeAsync(products);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Seeded 1 shop with {products.Count} products");
    }

    private async Task UpdateShopsWithoutIndustriesAsync()
    {
        var shopsWithoutIndustry = await _context.Shops
            .Where(s => s.IndustryId == null)
            .ToListAsync();

        if (!shopsWithoutIndustry.Any())
        {
            _logger.LogInformation("All shops have industries assigned");
            return;
        }

        var industries = await _context.Industries.Where(i => i.IsActive).ToListAsync();
        if (!industries.Any())
        {
            _logger.LogWarning("No industries found, cannot assign to shops");
            return;
        }

        // Get default industry (General Store)
        var generalStore = industries.FirstOrDefault(i => i.Slug == "general-store") 
            ?? industries.First();

        int updatedCount = 0;
        foreach (var shop in shopsWithoutIndustry)
        {
            // Try to assign industry based on shop name
            Industry? assignedIndustry = null;

            // Simple matching logic based on shop name
            var shopNameLower = shop.Name.ToLowerInvariant();
            
            if (shopNameLower.Contains("supermarket") || shopNameLower.Contains("grocery") || 
                shopNameLower.Contains("market") || shopNameLower.Contains("store"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "grocery-supermarket") 
                    ?? industries.FirstOrDefault(i => i.Slug == "general-store");
            }
            else if (shopNameLower.Contains("restaurant") || shopNameLower.Contains("cafe") || 
                     shopNameLower.Contains("food") || shopNameLower.Contains("dining"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "restaurant-food");
            }
            else if (shopNameLower.Contains("pharmacy") || shopNameLower.Contains("medical") ||
                     shopNameLower.Contains("health") || shopNameLower.Contains("drug"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "pharmacy-health");
            }
            else if (shopNameLower.Contains("electronics") || shopNameLower.Contains("tech") ||
                     shopNameLower.Contains("appliance") || shopNameLower.Contains("computer"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "electronics-appliances");
            }
            else if (shopNameLower.Contains("fashion") || shopNameLower.Contains("clothing") || 
                     shopNameLower.Contains("apparel") || shopNameLower.Contains("boutique") ||
                     shopNameLower.Contains("garment"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "fashion-clothing");
            }
            else if (shopNameLower.Contains("beauty") || shopNameLower.Contains("cosmetic") ||
                     shopNameLower.Contains("salon") || shopNameLower.Contains("spa"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "beauty-cosmetics");
            }
            else if (shopNameLower.Contains("hardware") || shopNameLower.Contains("tool") ||
                     shopNameLower.Contains("construction") || shopNameLower.Contains("building"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "hardware-tools");
            }
            else if (shopNameLower.Contains("sports") || shopNameLower.Contains("fitness") ||
                     shopNameLower.Contains("gym") || shopNameLower.Contains("athletic"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "sports-fitness");
            }
            else if (shopNameLower.Contains("book") || shopNameLower.Contains("stationery") ||
                     shopNameLower.Contains("stationary") || shopNameLower.Contains("office"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "books-stationery");
            }
            else if (shopNameLower.Contains("automotive") || shopNameLower.Contains("car") || 
                     shopNameLower.Contains("auto") || shopNameLower.Contains("vehicle") ||
                     shopNameLower.Contains("tire") || shopNameLower.Contains("tyre"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "automotive");
            }
            else if (shopNameLower.Contains("jewelry") || shopNameLower.Contains("jewellery") ||
                     shopNameLower.Contains("watch") || shopNameLower.Contains("gold"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "jewelry-watches");
            }
            else if (shopNameLower.Contains("toy") || shopNameLower.Contains("game"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "toys-games");
            }
            else if (shopNameLower.Contains("pet") || shopNameLower.Contains("animal"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "pet-supplies");
            }
            else if (shopNameLower.Contains("home") || shopNameLower.Contains("garden") ||
                     shopNameLower.Contains("furniture") || shopNameLower.Contains("decor"))
            {
                assignedIndustry = industries.FirstOrDefault(i => i.Slug == "home-garden");
            }

            // Use assigned industry or default to General Store
            shop.IndustryId = assignedIndustry?.Id ?? generalStore.Id;
            shop.UpdatedAt = DateTime.UtcNow;
            updatedCount++;
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation($"Updated {updatedCount} shops with industry assignments");
    }
}
