namespace newstreetbackend.Services;

public interface IImageUploadService
{
    Task<string> UploadImageAsync(Stream imageStream, string fileName, string folder);
    Task<bool> DeleteImageAsync(string publicId);
}
