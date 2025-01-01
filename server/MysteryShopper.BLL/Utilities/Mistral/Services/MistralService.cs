using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Mistral.Models;
using MysteryShopper.BLL.Utilities.Mistral.Services.IServices;
using static System.Net.Mime.MediaTypeNames;
using System.Text.Json;
using System.Text;
using MysteryShopper.BLL.Utilities.Mistral.Utils;

namespace MysteryShopper.BLL.Utilities.Mistral.Services
{
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
                content = content.Substring(4);
            }

            var tagData = JsonSerializer.Deserialize<TagData>(content);

            if (tagData is null)
            {
                throw new InternalServerErrorException("Tags can't be determined");
            }

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

            var promptJson = new StringContent(JsonSerializer.Serialize(prompt), Encoding.UTF8, Application.Json);

            var httpResponseMessage = await httpMistralClient.PostAsync("v1/chat/completions", promptJson, cancellationToken);

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
