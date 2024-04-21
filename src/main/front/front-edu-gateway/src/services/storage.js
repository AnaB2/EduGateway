// storage.js

export function saveToken(token, email, userType) {
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





