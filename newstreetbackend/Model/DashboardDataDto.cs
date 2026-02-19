namespace newstreetbackend.Model;

public class DashboardDataDto
{
    public SystemStatisticsDto Statistics { get; set; } = new();
    public List<AdminShopDto> PendingShops { get; set; } = new();
    public List<AdminUserDto> RecentUsers { get; set; } = new();
}

