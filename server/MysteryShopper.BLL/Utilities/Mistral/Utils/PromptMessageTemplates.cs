namespace MysteryShopper.BLL.Utilities.Mistral.Utils
{
    public static class PromptMessageTemplates
    {
        public static string CategorizationMessage(string orderDescription, string category, IEnumerable<string> existingTags) => 
            "I will pass you the category name and list of tags for this category." +
            "Then i will pass an order text." +
            "Your task is to define which tags associate with this order." +
            "The response must be a json object with fields: tags and newTags." +
            "tags field should contain tags which are suitable for this order and present in the list." +
            "newTags field should contain tags which are suitable for this order but not present in the list." +
            "If you have some tags that are not present in the list but related to the category, add them to the newTags list." +
            "New tags should belong to the provided category." +
            "If there are no tags that are suitable for this order set both fields to emply lists." +
            $"Category: {category}" +
            $"Tags: {string.Join(", ", existingTags)}" +
            $"Order text: {orderDescription}";


    }
}
