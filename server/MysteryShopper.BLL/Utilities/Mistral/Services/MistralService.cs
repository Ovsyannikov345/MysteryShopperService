using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Mistral.Models;
using MysteryShopper.BLL.Utilities.Mistral.Utils;
using System.Net.Http.Json;
using System.Text.Json;

namespace MysteryShopper.BLL.Utilities.Mistral.Services
{
    public interface IMistralService
    {
        Task<TagData> GetOrderTagsAsync(string orderDescription, string category, IEnumerable<string> existingTags, CancellationToken cancellationToken = default);
    }

    public class MistralService(IHttpClientFactory httpClientFactory) : IMistralService
    {
        public async Task<TagData> GetOrderTagsAsync(
            string orderDescription,
            string category,
            IEnumerable<string> existingTags,
            CancellationToken cancellationToken = default)
        {
            MistralResponse mistralResponse;

            try
            {
                mistralResponse = await SendRequestAsync(
                    PromptMessageTemplates.CategorizationMessage(orderDescription, category, existingTags), cancellationToken);
            }
            catch
            {
                throw new InternalServerErrorException("Categorization failed");
            }

            var content = mistralResponse.Choices[0].Message.Content.Trim('`');

            if (content.StartsWith("json"))
            {
                content = content[4..];
            }

            var tagData = JsonSerializer.Deserialize<TagData>(content)
                ?? throw new InternalServerErrorException("Tags can't be determined");

            return tagData;
        }

        private async Task<MistralResponse> SendRequestAsync(string promptText, CancellationToken cancellationToken = default)
        {
            var httpMistralClient = httpClientFactory.CreateClient("MistralAPIClient");

            var prompt = new
            {
                model = "mistral-large-latest",
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = promptText,
                    }
                }
            };

            var httpResponseMessage = await httpMistralClient.PostAsJsonAsync("v1/chat/completions", JsonSerializer.Serialize(prompt), cancellationToken);

            if (!httpResponseMessage.IsSuccessStatusCode)
            {
                throw new InternalServerErrorException("Mistral request failed");
            }

            using var contentStream = await httpResponseMessage.Content.ReadAsStreamAsync(cancellationToken);

            MistralResponse? mistralResponse = await JsonSerializer.DeserializeAsync<MistralResponse>(contentStream, cancellationToken: cancellationToken)
                ?? throw new InternalServerErrorException("Mistral request failed");

            return mistralResponse;
        }
    }
}
