const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

export function saveToken(token, userType) {
    // Guarda el token en el almacenamiento local
    localStorage.setItem('token', token);
    // Guarda el tipo de usuario en el almacenamiento local
    localStorage.setItem('userType', userType);
}


// Función para obtener el token del almacenamiento local
export function getToken() {
    return localStorage.getItem('token');

}

// Función para obtener el tipo de usuario del almacenamiento local
export function getUserType() {
    return localStorage.getItem('userType');
}






const authorizedFetch = async (url, options) => {
    const token = getToken();

    // Verificar si hay un token disponible
    if (token) {
        // Si existe un token, agregar el encabezado de autorización a las opciones de la solicitud
        if (!options.headers) {
            options.headers = {};
        }
        options.headers.Authorization = `Bearer ${token}`;
    } else {
        // Si no hay un token disponible, lanzar un error
        throw new Error('Token de sesión no encontrado.');
    }

    // Realizar la solicitud HTTP utilizando fetch con las opciones proporcionadas
    const response = await fetch(url, options);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
        // Si la respuesta no es exitosa, lanzar un error con el mensaje apropiado
        throw new Error('Network response was not ok');
    }

    // Devolver el cuerpo de la respuesta en formato JSON
    return response.json();
};



export const signUpUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/sign-up-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to signup:", error);
        throw error;
    }
};

export const signUpInstitution = async (institutionData) => {
    try {
        const response = await fetch(`${API_URL}/sign-up-institution`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(institutionData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to signup:", error);
        throw error;
    }
};

export const loginUser = async (userData) => {
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
            saveToken(responseData.token);

            // Imprime el token en la consola del navegador
            console.log('Token received:', responseData.token);
        } else {
            // Si la respuesta no incluye un token, lanza un error
            throw new Error('Token not found in response');
        }

        return responseData; // Devuelve la respuesta completa, que puede contener otros datos además del token
    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
};

export const loginInstitution = async (institutionData) => {
    try {
        const response = await fetch(`${API_URL}/log-in-institution`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(institutionData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to login institution:", error);
        throw error;
    }
};