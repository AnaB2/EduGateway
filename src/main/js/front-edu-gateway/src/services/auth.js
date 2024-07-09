import { saveToken, removeToken} from './storage';
import {inicializarConexionWebSocket} from "./Api";

const API_URL = 'http://localhost:4321';


export async function logoutUser(navigation){
    try {
        await removeToken();
        navigation('/')
    }catch (error){
        console.log("Error al cerrar sesión")
        throw error
    }
}

export async function loginUser(userData, navigation) {
    try {
        const response = await fetch(`${API_URL}/log-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();


        // Verifica si la respuesta incluye un token
        if (responseData.token) {
            // Guarda el token en el almacenamiento local del navegador
            saveToken(responseData.token, responseData.email, responseData.userType, responseData.name, responseData.id);

            // Inicializa la conexión WebSocket y espera a que esté abierta
            const notifications = inicializarConexionWebSocket();

            // Enviar un mensaje WebSocket basado en el tipo de usuario
            if (responseData.userType === 'participant') {
                const message = JSON.stringify({ userId: responseData.id });
                // Verifica si el WebSocket está en estado OPEN antes de enviar el mensaje
                if (notifications.readyState === WebSocket.OPEN) {
                    notifications.send(message);
                } else {
                    console.error('WebSocket is not open');
                }
                navigation('inicio-participante'); // Redirige a la página de participante
            } else if (responseData.userType === 'institution') {
                const message = JSON.stringify({ institutionId: responseData.id });
                // Verifica si el WebSocket está en estado OPEN antes de enviar el mensaje
                if (notifications.readyState === WebSocket.OPEN) {
                    notifications.send(message);
                } else {
                    console.error('WebSocket is not open');
                }
                navigation('inicio-institucion'); // Redirige a la página de institución
            }
        } else {
            // Si la respuesta no incluye un token, lanza un error
            throw new Error('Token not found in response');
        }

        return responseData; // Devuelve la respuesta completa, que puede contener otros datos además del token
    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
}
