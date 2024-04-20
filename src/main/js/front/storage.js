// storage.js

export function saveToken(token, email, userType) {
    // Guarda el token en el almacenamiento local
    localStorage.setItem('token', token);
    // Guarda el tipo de usuario en el almacenamiento local
    localStorage.setItem('userType', userType);
    localStorage.setItem('email', email);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function getUserType() {
    return localStorage.getItem('userType');
}

export function getEmail() {
    return localStorage.getItem('email');
}