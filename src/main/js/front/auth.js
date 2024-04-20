// auth.js
import { saveToken } from './storage';


const API_URL = 'http://localhost:4321';




export const loginUser = async(userData, navigation) => {

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
            saveToken(responseData.token, responseData.email, responseData.userType);

            // Redirige a la página correspondiente
            if (responseData.userType === 'participant') {
                navigation.navigate('HomeUser'); // Redirige a la página de participante

            } else if (responseData.userType === 'institution') {
                navigation.navigate('HomeInstitution'); // Redirige a la página de institución
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

// Otras funciones relacionadas con la autenticación...
