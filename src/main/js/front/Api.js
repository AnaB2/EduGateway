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

export const deleteOpportunity = async (name) => {
    try {
        const response = await authorizedFetch(`${API_URL}/delete-opportunity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
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

export const modifyOpportunity = async (opportunityData) => {
    try {
        const response = await authorizedFetch(`${API_URL}/modify-opportunity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opportunityData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to modify opportunity:", error);
        throw error;
    }
};

