using newstreetbackend.Entities;

namespace newstreetbackend.Repository;

public interface IProductInterestRepository
{
    Task<ProductInterest> CreateInterestAsync(ProductInterest interest);
    Task<int> GetInterestCountByProductIdAsync(Guid productId);
    Task<Dictionary<Guid, int>> GetInterestCountsByProductIdsAsync(List<Guid> productIds);
    Task<bool> HasUserExpressedInterestAsync(Guid productId, string? userEmail = null);
}
