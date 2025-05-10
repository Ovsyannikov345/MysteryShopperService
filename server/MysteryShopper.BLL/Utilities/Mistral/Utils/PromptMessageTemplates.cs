namespace MysteryShopper.BLL.Utilities.Mistral.Utils;

public static class PromptMessageTemplates
{
    public static string CategorizationMessage(string orderDescription, string category, IEnumerable<string> existingTags) =>
        "You are a skilled data analyst with extensive experience in categorizing and tagging content for various industries, especially in the retail sector. " +
        "Your expertise lies in understanding the nuances of customer feedback and secret shopper reports to assign appropriate tags that enhance data organization and retrieval. " +
        "Your task is to analyze a provided secret shopper order text and choose suitable tags from a provided tag list. " +
        "If you cannot find any existing tags that fit the content, you will suggest new tags strictly based on the provided category and put them to the newTags list. " +
        $"All tags must be only about the {category} and similar to the existing tags." +
        "The output should strictly be a JSON object with the fields: \"tags\" and \"newTags\". " +
        "Here are the details you need to work with: " +
        $"- Secret Shopper Order Text: {orderDescription}." +
        $"- Provided Tag List: {string.Join(", ", existingTags)}" +
        $"- Category: {{category}}. " +
        "Please ensure your output is formatted as follows: ```json { \"tags\": [], \"newTags\": [] } ``` ";
}
