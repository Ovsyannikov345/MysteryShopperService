// TODO implement with real call.

const completionTimeMockResponse = {
    timeStart: 2,
    timeEnd: 3,
};

const compatibilityMockResponse = {
    age: 5,
    gender: 5,
    profession: 4,
    experience: 5,
};

const getCompletionTime = async () => {
    try {
        const response = {
            data: completionTimeMockResponse,
        };

        setTimeout(() => {}, 5000);

        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            console.log("Server did not respond.");
        } else {
            console.log("Error while creating request");
        }
    }
};

const getCompatibility = async () => {
    try {
        const response = {
            data: compatibilityMockResponse,
        };

        setTimeout(() => {}, 5000);

        return response;
    } catch (error) {
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
