const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

export function saveToken(token,email, userType) {
    // Guarda el token en el almacenamiento local
    localStorage.setItem('token', token);
    // Guarda el tipo de usuario en el almacenamiento local
    localStorage.setItem('userType', userType);
    localStorage.setItem('email', email);
}


// Función para obtener el token del almacenamiento local
export function getToken() {
    return localStorage.getItem('token');

}

// Función para obtener el tipo de usuario del almacenamiento local
export function getUserType() {
    return localStorage.getItem('userType');
}

export function getEmail() {
    return localStorage.getItem('email');
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
}








