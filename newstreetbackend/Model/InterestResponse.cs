namespace newstreetbackend.Model;

public class InterestResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int InterestCount { get; set; }
}
