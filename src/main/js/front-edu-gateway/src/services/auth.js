import { saveToken, removeToken} from './storage';
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

export async function loginUser(userData, navigation){

    try {
        const response = await fetch(`${API_URL}/log-in`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
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

            // Redirige a la página correspondiente
            if (responseData.userType === 'participant') {
                navigation('inicio-participante'); // Redirige a la página de participante

            } else if (responseData.userType === 'institution') {
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