

export function saveData(jsonResponse) {
    // Parse the JSON response
    const data = JSON.parse(jsonResponse);

    // Store the values in local storage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userType', data.userType);
    localStorage.setItem('email', data.email);
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

