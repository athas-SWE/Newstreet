namespace newstreetbackend.Model;

public class ExpressInterestRequest
{
    public Guid ProductId { get; set; }
    public string? UserEmail { get; set; }
    public string? UserName { get; set; }
    public string? UserPhone { get; set; }
}
