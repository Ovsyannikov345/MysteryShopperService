using System.Text.Json.Serialization;

namespace MysteryShopper.BLL.Utilities.Mistral.Models
{
    public class Message
    {
        [JsonPropertyName("role")]
        public required string Role { get; set; }

        [JsonPropertyName("content")]
        public required string Content { get; set; }

        [JsonPropertyName("tool_calls")]
        public required object ToolCalls { get; set; }
    }
}
