using MysteryShopper.BLL.Utilities.Exceptions;
using MysteryShopper.BLL.Utilities.Mistral.Models;
using MysteryShopper.BLL.Utilities.Mistral.Models.OrderAnalysis;
using MysteryShopper.BLL.Utilities.Mistral.PromptTemplates;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories;
using System.Net.Http.Json;
using System.Text.Json;

namespace MysteryShopper.BLL.Utilities.Mistral.Services;

public interface IMistralService
{
    Task<OrderAnalysisResult> GetOrderAnalysisAsync(Guid orderId, Guid userId, CancellationToken cancellationToken = default);
}

public class MistralService(IUserRepository userRepository, IOrderRepository orderRepository, IHttpClientFactory httpClientFactory) : IMistralService
{
    private readonly int _retryCount = 3;

    public async Task<OrderAnalysisResult> GetOrderAnalysisAsync(Guid orderId, Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.GetAsync(u => u.Id == userId, cancellationToken: cancellationToken)
            ?? throw new NotFoundException("User is not found");

        var order = await orderRepository.GetAsync(o => o.Id == orderId, cancellationToken: cancellationToken)
            ?? throw new NotFoundException("Order is not found");

        var compatibility = await GetCompatibilityAsync(user, order, cancellationToken: cancellationToken);

        var timeToComplete = await GetTimeToCompleteAsync(order, cancellationToken: cancellationToken);

        return new()
        {
            Compatibility = compatibility,
            TimeToComplete = timeToComplete,
        };
    }

    private async Task<Compatibility?> GetCompatibilityAsync(User user, Order order, int retryNumber = 0, CancellationToken cancellationToken = default)
    {
        if (retryNumber > _retryCount)
        {
            return null;
        }

        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);

        try
        {
            var compatibilityResponse = await SendRequestAsync(
                PromptMessageTemplates.CompatibilityMessage(
                    GetUserAge(user),
                    user.Gender,
                    user.WorkingExperience,
                    user.Description,
                    order.Description),
                cancellationToken);

            var content = compatibilityResponse.Choices[0].Message.Content;

            string cleanedJson = content
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();

            var compatibility = JsonSerializer.Deserialize<Compatibility>(cleanedJson);

            return compatibility;
        }
        catch
        {
            return await GetCompatibilityAsync(user, order, retryNumber + 1, cancellationToken);
        }
    }

    private async Task<double?> GetTimeToCompleteAsync(Order order, int retryNumber = 0, CancellationToken cancellationToken = default)
    {
        if (retryNumber > _retryCount)
        {
            return null;
        }

        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);

        try
        {
            var timeToCompleteResponse = await SendRequestAsync(PromptMessageTemplates.TimeToCompleteMessage(order.Description), cancellationToken);

            var content = timeToCompleteResponse.Choices[0].Message.Content;

            Console.WriteLine($"\n\n\n\n\n{content}\n\n\n\n\n");

            return double.Parse(content);
        }
        catch
        {
            return await GetTimeToCompleteAsync(order, retryNumber + 1, cancellationToken);
        }
    }

    private static int? GetUserAge(User user)
    {
        if (user.BirthDate is null)
        {
            return null;
        }

        var birthDate = (DateTime)user.BirthDate;

        var userAge = DateTime.Today.Year - birthDate.Year;

        if (DateTime.Today.Month < birthDate.Month ||
            (DateTime.Today.Month == birthDate.Month && DateTime.Today.Day < birthDate.Day))
        {
            userAge--;
        }

        return userAge;
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

        var httpResponseMessage = await httpMistralClient.PostAsJsonAsync("v1/chat/completions", prompt, cancellationToken);

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
