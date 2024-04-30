import {getEmail, getToken} from "./storage";

const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL


// const addAuthorizationHeader = (options) => {
//     const token = getToken();
//     const email = getEmail(); // Obtener el email del almacenamiento local
//
//     console.log("Token obtenido:", token);
//     console.log("Email obtenido:", email);
//
//     // Verificar si hay un token disponible
//     if (token) {
//         // Si existe un token, agregar el encabezado de autorización a las opciones de la solicitud
//         if (!options.headers) {
//             options.headers = {};
//         }
//         options.headers.Authorization = `${token}`;
//         options.headers.Email = email;
//
//     } else {
//         // Si no hay un token disponible, lanzar un error
//         throw new Error('Token de sesión no encontrado.');
//     }
//
//     console.log("Encabezado de autorización agregado:", options.headers.Authorization);
//
//     return options;
// };

export const addOpportunity = async (opportunityData) => {
    try {
        const token = getToken();
        const email = getEmail();

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token && email) {
            headers.Authorization = `${token}`;
            headers.Email = email;
        } else {
            throw new Error('Token de sesión no encontrado.');
        }

        const response = await fetch(`${API_URL}/add-opportunity`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(opportunityData)
        });

        console.log("Datos de la oportunidad:", opportunityData);

        if (response.status === 401) {
            throw new Error('Unauthorized access');
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to add opportunity:", error);
        throw error;
    }
};

export const deleteOpportunity = async (name) => {
    try {
        const response = await fetch(`${API_URL}/delete-opportunity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name}),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to delete opportunity:", error);
        throw error;
    }
};

export const modifyOpportunity = async (opportunityData, previousName) => {
    try {
        opportunityData.previousName = previousName;
        const response = await fetch(`${API_URL}/edit-opportunity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opportunityData), // convierte objeto opportunityData en JSON
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json(); // devuelve objeto
    } catch (error) {
        console.error("Failed to modify opportunity:", error);
        throw error;
    }
};

export async function getOpportunitiesByInstitution() {
    try {
        const token = getToken();
        const email = getEmail();
        const headers = {'Content-Type': 'application/json'};

        if (!token || !email) {throw new Error('Token o correo no encontrados.');}

        const queryParams = new URLSearchParams({ email: email }).toString();

        const response = await fetch(`${API_URL}/get-opportunities-institution?${queryParams}`, {
            method: 'GET',
            headers: headers,
        });

        if (response.status === 401) {
            throw new Error('Unauthorized access');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json(); // devuelve objeto

    } catch (error) {
        console.error("Failed to get opportunities by institution:", error);
        throw error;
    }
}

export async function getOpportunities() {
    try {
        const token = getToken();
        const email = getEmail();
        const headers = {'Content-Type': 'application/json'};

        if (!token || !email) {throw new Error('Token o correo no encontrados.');}

        const response = await fetch(`${API_URL}/get-opportunities`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json(); // devuelve objeto

    } catch (error) {
        console.error("Failed to get opportunities:", error);
        throw error;
    }
}

export async function addInscription(email, opportunityId, formData){
    try {

        const response = await fetch(`${API_URL}/add-inscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Email': email,
                'OpportunityId': opportunityId
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();

    } catch (error) {
        console.error('Failed to add inscription:', error);
        throw error;
    }
}

export async function getInscriptions() {
    try {
        const token = getToken();
        const email = getEmail();
        if (!token || !email) {throw new Error('Token o correo no encontrados.');}

        const headers = {
            'Content-Type': 'application/json',
            'Email' : email,
            'Token' : token
        };

        const response = await fetch(`${API_URL}/get-inscriptions`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json(); // devuelve objeto

    } catch (error) {
        console.error("Failed to get inscriptions:", error);
        throw error;
    }
}

export async function approveInscription(emailParticipante){
    try {
        const headers = {
            'Content-Type': 'application/json',
            'emailParticipante' : emailParticipante
        };

        console.log("HEADER")
        console.log(headers)

        const response = await fetch( `${API_URL}/approve-inscription`, {
                method: 'POST',
                headers: headers
            }
        )

        console.log("RESPUESTA")
        console.log(response)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    }
    catch (error){
        console.error("Failed to approve inscription:", error);
        throw error;
    }
}

export async function rejectInscription(emailParticipante){
    
    try {
        const headers = {
            'Content-Type': 'application/json',
            'emailParticipante' : emailParticipante
        };
        
        const response = await fetch( `${API_URL}/reject-inscription`, {
                method: 'POST',
                headers: headers
            }
        )
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    }
    catch (error){
        console.error("Failed to reject inscription:", error);
        throw error;
    }
}