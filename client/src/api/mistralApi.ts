import { aiServer } from ".";

const completionTimePrompt =
    "The following will be the text of an order on a mystery shopper search site. Your task is to determine " +
    "the time that the mystery shopper will spend to fulfill this order. Only the time when the mystery shopper is doing " +
    "something should be taken into account. If he is not waiting at the place of the order - the time is not counted " +
    "The answer must contain only JSON with hours count in format {startInterval: x, endInterval: y} and nothing else. Заголовок заказа: ";

const compatibilityPrompt =
    "Your task is to analyze the order of mystery shopper services. I will send you the text of " +
    "the order and the characteristics of the mystery shopper. You need to rate the compatibility of each characteristic with " +
    "the order from 1(incompatible) to 5(compatible). Response must contain only JSON with characteristics as keys and compatibility from 1 to 5 as values in format " +
    "{age: x, gender: x, profession: x, experience: x}. " +
    "Nothing except json should occur in response. Текст заказа: ";

const getCompletionTime = async (orderText: string) => {
    try {
        const request = {
            model: "mistral",
            prompt: completionTimePrompt + orderText,
            stream: false,
        };

        const response = await aiServer.post("/api/generate", request);

        const regex = /[-+]?[0-9]*\.?[0-9]+/g;

        const matches = response.data.response.match(regex);

        const numbers = matches ? matches.map(Number) : [];

        const timeIntervals = {
            startInterval: numbers[0],
            endInterval: numbers[1],
        };

        return {
            status: 200,
            data: timeIntervals,
        };
    } catch (error: any) {
        if (error.response) {
            return { error: "Failed to analyze" };
        } else if (error.request) {
            console.log("Server did not respond.");
        } else {
            console.log("Error while creating request");
        }
    }
};

const getCompatibility = async (orderText: string) => {
    try {
        const request = {
            model: "mistral",
            prompt: compatibilityPrompt + orderText,
            stream: false,
        };

        const response = await aiServer.post("/api/generate", request);

        const regex = /"(\w+)":\s*([-+]?\d*\.?\d+)/g;

        const pairs: any = {};

        let match;

        while ((match = regex.exec(response.data.response)) !== null) {
            const key = match[1];
            const value = Number(match[2]);
            pairs[key] = value;
        }

        return {
            status: 200,
            data: pairs,
        };
    } catch (error: any) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            console.log("Server did not respond.");
        } else {
            console.log("Error while creating request");
        }
    }
};

export { getCompletionTime, getCompatibility };
