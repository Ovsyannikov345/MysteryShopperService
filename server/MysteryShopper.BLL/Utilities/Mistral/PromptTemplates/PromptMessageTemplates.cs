using MysteryShopper.DAL.Entities.Enums;

namespace MysteryShopper.BLL.Utilities.Mistral.PromptTemplates;

public static class PromptMessageTemplates
{
    public static string CompatibilityMessage(int? userAge, GenderType userGender, string? userProfession, string? userProfileDescription, string? orderDescription) =>
        "You will be provided with two sets of information: user details and a secret shopper order description. " +
        "Your task is to analyze the compatibility of the user with the order based on four parameters: age, gender, profession, and experience. " +
        "Parameter can have value from 1 to 5. Ensure that your response contains only json and nothing else.\r\n\r\n" +
        "Follow these steps:\r\n\r\n" +
        "Evaluate the user’s age against any age requirements or preferences of the order.\r\n" +
        "Assess the gender compatibility based on the given description of the order.\r\n" +
        "Analyze the user’s profession in relation to the order’s criteria or needs.\r\n" +
        "Consider the user’s experience and how it aligns with any specified requirements or desirable attributes of the order.\r\n" +
        "Return your analysis in the following JSON format:\r\n" +
        "{\r\n\"age\": <compatibility score=\"\">,\r\n\"gender\": <compatibility score=\"\">,\r\n\"profession\": <compatibility score=\"\">,\r\n\"experience\": <compatibility score=\"\">\r\n}\r\n\r\n" +
        "The user’s details and the secret shopper order will be provided below, surrounded by triple quotes.\r\n\r\n" +
        "User Details:\r\n" +
        "\"\"\"\r\n" +
        $"Age: {(userAge is null ? "Not provided" : userAge)}\r\n" +
        $"Gender: {(userGender == GenderType.Male ? "Male" : "Female")}\r\n" +
        $"Profession: {(string.IsNullOrWhiteSpace(userProfession) ? "Not provided" : userProfession)}\r\n" +
        $"Profile description: {(string.IsNullOrWhiteSpace(userProfileDescription) ? "Not provided" : userProfileDescription)}\r\n" +
        "\"\"\"\r\n\r\n" +
        "Secret Shopper Order:\r\n" +
        "\"\"\"\r\n" +
        $"{(string.IsNullOrWhiteSpace(orderDescription) ? "Not provided" : orderDescription)}\r\n" +
        "\"\"\"";
}
