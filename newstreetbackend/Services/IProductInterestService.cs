using newstreetbackend.Model;

namespace newstreetbackend.Services;

public interface IProductInterestService
{
    Task<InterestResponse> ExpressInterestAsync(ExpressInterestRequest request);
    Task<int> GetInterestCountAsync(Guid productId);
    Task<Dictionary<Guid, int>> GetInterestCountsAsync(List<Guid> productIds);
}
