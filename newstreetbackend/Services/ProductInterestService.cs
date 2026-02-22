using newstreetbackend.Entities;
using newstreetbackend.Model;
using newstreetbackend.Repository;

namespace newstreetbackend.Services;

public class ProductInterestService : IProductInterestService
{
    private readonly IProductInterestRepository _interestRepository;
    private readonly IProductRepository _productRepository;

    public ProductInterestService(
        IProductInterestRepository interestRepository,
        IProductRepository productRepository)
    {
        _interestRepository = interestRepository;
        _productRepository = productRepository;
    }

    public async Task<InterestResponse> ExpressInterestAsync(ExpressInterestRequest request)
    {
        // Verify product exists
        var product = await _productRepository.GetProductByIdAsync(request.ProductId);
        if (product == null)
        {
            throw new KeyNotFoundException("Product not found");
        }

        // Check if user already expressed interest (if email provided)
        if (!string.IsNullOrEmpty(request.UserEmail))
        {
            var hasInterest = await _interestRepository.HasUserExpressedInterestAsync(
                request.ProductId, request.UserEmail);
            if (hasInterest)
            {
                return new InterestResponse
                {
                    Success = false,
                    Message = "You have already expressed interest in this product"
                };
            }
        }

        var interest = new ProductInterest
        {
            ProductId = request.ProductId,
            UserEmail = request.UserEmail,
            UserName = request.UserName,
            UserPhone = request.UserPhone,
            CreatedAt = DateTime.UtcNow
        };

        await _interestRepository.CreateInterestAsync(interest);

        var count = await _interestRepository.GetInterestCountByProductIdAsync(request.ProductId);

        return new InterestResponse
        {
            Success = true,
            Message = "Interest expressed successfully",
            InterestCount = count
        };
    }

    public async Task<int> GetInterestCountAsync(Guid productId)
    {
        return await _interestRepository.GetInterestCountByProductIdAsync(productId);
    }

    public async Task<Dictionary<Guid, int>> GetInterestCountsAsync(List<Guid> productIds)
    {
        return await _interestRepository.GetInterestCountsByProductIdsAsync(productIds);
    }
}
