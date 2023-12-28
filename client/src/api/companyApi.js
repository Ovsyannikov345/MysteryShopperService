import host from ".";

const getProfile = async () => {
    try {
        const response = await host.get("/api/company");

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

const getCompany = async (id) => {
    try {
        const response = await host.get(`/api/companies/${id}`);

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

const updateCompany = async (id, companyData) => {
    try {
        const response = await host.put(`/api/companies/${id}`, companyData);

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

        const response = await host.post(`/api/companies/${id}/avatar`, formData, {
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

export { getProfile, getCompany, updateCompany, updateAvatar };
