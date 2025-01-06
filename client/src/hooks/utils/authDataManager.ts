import { Roles } from "../../utils/enums/roles";

interface AuthData {
    accessToken: string;
    refreshToken: string;
    role: Roles;
}

class AuthDataManager {
    static saveAuthData = (data: AuthData) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", data.role.toString());
        window.dispatchEvent(new Event("auth"));
    };

    static clearAuthData = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("auth"));
    };
}

export default AuthDataManager;
