import host from ".";

const getProfile = async () => {
    try {
        const response = await host.get("/api/user");

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

const updateUser = async (id, userData) => {
    try {
        const response = await host.put(`/api/users/${id}`, userData);

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

const updateAvatar = async (id, image) => {
    try {
        let formData = new FormData();
        formData.append("image", image);

        const response = await host.post(`/api/users/${id}/avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

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

export { getProfile, updateUser, updateAvatar };
