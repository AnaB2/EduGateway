import { saveToken, removeToken} from './storage';
import {initializeWebSocket} from "./Api";

const API_URL = 'http://localhost:4321';


// Log out user and clear local storage
export const logoutUser = async (navigate) => {
    try {
        await removeToken();
        navigate("/");
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
};

// Log in user and initialize WebSocket
export const loginUser = async (credentials, navigate) => {
    try {
        const response = await fetch(`${API_URL}/log-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();

        if (data.token) {
            saveToken(data.token, data.email, data.userType, data.name, data.id);
            initializeWebSocket((message) => console.log("WebSocket message:", message));

            // Navigate based on user type
            navigate(data.userType === "participant" ? "inicio-participante" : "inicio-institucion");
        } else {
            throw new Error("Token not found in response");
        }

        return data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

