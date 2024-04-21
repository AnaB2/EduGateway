// Importa función 'saveToken' para guardar token de autenticación en almacenamiento local de navegador.
import { saveToken } from './storage.js';
const API_URL = 'http://localhost:4321';

// Función que manda solicitud de inicio de sesión al servidor (institución o participante).
// Si la respuesta a la solicitud incluye un token, se guarda en el almacenamiento local del navegador y se redirige al usuario a la página correspondiente según el tipo de usuario.
// Si la respuesta a la solicitud NO incluye un token entonces no es posible iniciar sesión, y lanza un error.
// Devuelve respuesta completa que puede contener otros datos ademas de token.

export async function loginUser(userData, navigation){

    try {
        // Envía solicitud POST a ruta '/log-in' con objeto userData que contiene credenciales de inicio de sesión
        const response = await fetch( `${API_URL}/log-in`, { method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(userData),});

        if (!response.ok) {throw new Error('Network response was not ok');}
        const responseData = await response.json();

        // Si la respuesta incluye un token lo guarda en el almacenamiento local del navegador
        // Redirige a la página correspondiente según tipo de usuario.
        if (responseData.token) {
            saveToken(responseData.token, responseData.email, responseData.userType);
            if (responseData.userType === 'participant') {
                navigation.navigate('HomeUser'); // Participante
            } else if (responseData.userType === 'institution') {
                navigation.navigate('HomeInstitution'); // Institución
            }
        }
        // Si la respuesta no incluye un token, lanza un error
        else {
            throw new Error('Token not found in response');
        }

        // Devuelve respuesta completa que puede contener otros datos además del token
        return responseData;

    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
}

// Otras funciones relacionadas con la autenticación...