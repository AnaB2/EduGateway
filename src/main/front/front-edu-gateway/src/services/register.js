// http.js

const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

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
