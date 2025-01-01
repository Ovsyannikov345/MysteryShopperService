using MysteryShopper.BLL.Utilities.Mistral.Models;

namespace MysteryShopper.BLL.Utilities.Mistral.Services.IServices
{
    public interface IMistralService
    {
        Task<TagData> GetOrderTagsAsync(string orderDescription, string category, IEnumerable<string> existingTags, CancellationToken cancellationToken = default);
    }
}
