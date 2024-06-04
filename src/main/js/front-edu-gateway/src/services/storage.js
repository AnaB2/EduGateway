export function saveToken(token, email, userType, name,id) {
    // Guarda el token en el almacenamiento local
    localStorage.setItem('token', token);
    // Guarda el tipo de usuario en el almacenamiento local
    localStorage.setItem('userType', userType);
    // Guarda el correo electrónico en el almacenamiento local
    localStorage.setItem('email', email);
    // Guarda el nombre en el almacenamiento local
    localStorage.setItem('name', name);
    // Guarda el id en el almacenamiento local
    localStorage.setItem('id', id);
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

export function getName() {
    return localStorage.getItem('name');
}

export function getId() {
    return localStorage.getItem('id');
}


export function removeToken() {
    // Elimina el token del almacenamiento local
    localStorage.removeItem('token');
    // Elimina el tipo de usuario del almacenamiento local
    localStorage.removeItem('userType');
    // Elimina el correo electrónico del almacenamiento local
    localStorage.removeItem('email');
    // Elimina el nombre del almacenamiento local
    localStorage.removeItem('name');
    // Elimina el id del almacenamiento local
    localStorage.removeItem('id');
}
