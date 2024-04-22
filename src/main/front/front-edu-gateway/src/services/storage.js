export function saveToken(token, email, userType) {
    // Guarda el token en el almacenamiento local
    localStorage.setItem('token', token);
    // Guarda el tipo de usuario en el almacenamiento local
    localStorage.setItem('userType', userType);
    // Guarda el correo electrónico en el almacenamiento local
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

export function removeToken() {
    // Elimina el token del almacenamiento local
    localStorage.removeItem('token');
    // Elimina el tipo de usuario del almacenamiento local
    localStorage.removeItem('userType');
    // Elimina el correo electrónico del almacenamiento local
    localStorage.removeItem('email');
}


