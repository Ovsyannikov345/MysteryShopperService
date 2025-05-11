using System.Text.Json.Serialization;

namespace MysteryShopper.BLL.Utilities.Mistral.Models.OrderAnalysis;

public class Compatibility
{
    [JsonPropertyName("age")]
    public int Age { get; set; }

    [JsonPropertyName("gender")]
    public int Gender { get; set; }

    [JsonPropertyName("profession")]
    public int Profession { get; set; }

    [JsonPropertyName("experience")]
    public int Experience { get; set; }
}
