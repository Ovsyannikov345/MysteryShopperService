using MysteryShopper.BLL.Utilities.Mistral.Models;

namespace MysteryShopper.BLL.Utilities.Mistral.Services.IServices
{
    public interface IMistralService
    {
        Task<MistralResponse> SendRequestAsync(string promptText, CancellationToken cancellationToken = default);

        Task<TagData> GetOrderTagsAsync(string orderDescription, string category, IEnumerable<string> existingTags, CancellationToken cancellationToken = default);
    }
}
