using System.Text.Json.Serialization;

namespace MysteryShopper.BLL.Utilities.Mistral.Models;

public class TagData
{
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = [];

    [JsonPropertyName("newTags")]
    public List<string> NewTags { get; set; } = [];
}
