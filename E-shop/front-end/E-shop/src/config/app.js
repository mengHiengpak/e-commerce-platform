import axios from "axios";
import {apiUrlBase} from "./env.js";
import {getToken, setToken} from "./token.js";


export const api = axios.create({
    baseURL: `${apiUrlBase}`,
    withCredentials: true,
})

// The API reads the JWT from a `token` request header. Relying on the session
// cookie alone fails whenever the browser withholds it (cross-site third-party
// cookie blocking, or a non-https origin where the `Secure` cookie is dropped),
// which surfaces as a 401 on /customer/me right after a successful sign in.
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.set("token", token);
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const token = getToken();
            if (token) {
                setToken("");
                window.dispatchEvent(new Event("auth:unauthorized"));
            }
        }
        return Promise.reject(error);
    }
);