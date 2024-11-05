﻿using System.Text.Json.Serialization;

namespace MysteryShopper.BLL.Utilities.Mistral.Models
{
    public class Choice
    {
        [JsonPropertyName("index")]
        public int Index { get; set; }

        [JsonPropertyName("message")]
        public required Message Message { get; set; }

        [JsonPropertyName("finish_reason")]
        public required string FinishReason { get; set; }
    }
}
