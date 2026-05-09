import API from "../utils/axiosConfig";

export const loginHr = async (loginData) => {

    return await API.post(
        "/auth/login",
        loginData
    );
};