import {getEmail, getToken} from "./storage";

const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL


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

export const deleteOpportunity = async (opportunityName) => {
    try {
        const token = getToken();
        const email = getEmail();

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token && email) {
            headers.Authorization = token;
            headers.Email = email;
        } else {
            throw new Error('Token de sesión no encontrado.');
        }

        const response = await fetch(`${API_URL}/delete-opportunity/${opportunityName}`, {
            method: 'DELETE',
            headers: headers
        });

        if (response.status === 401) {
            throw new Error('Acceso no autorizado');
        }

        if (!response.ok) {
            throw new Error('La respuesta de red no fue exitosa');
        }

        return await response.json();
    } catch (error) {
        console.error("Error al eliminar la oportunidad:", error);
        throw error;
    }
};

export const getOpportunities = async () => {
    try {
        const response = await fetch(`${API_URL}/get-opportunities`);

        if (response.status === 401) {
            throw new Error('Acceso no autorizado');
        }

        if (!response.ok) {
            throw new Error('La respuesta de red no fue exitosa');
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener las oportunidades:", error);
        throw error;
    }
};