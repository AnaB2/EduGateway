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

export const loginUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/log-in-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();

        // Verifica si la respuesta incluye un token
        if (responseData.token) {
            // Guarda el token en el almacenamiento local del navegador
            localStorage.setItem('token', responseData.token);

            // Imprime el token en la consola del navegador
            console.log('Token received:', responseData.token);
        } else {
            // Si la respuesta no incluye un token, lanza un error
            throw new Error('Token not found in response');
        }

        return responseData; // Devuelve la respuesta completa, que puede contener otros datos además del token
    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
};



export const loginInstitution = async (institutionData) => {
    try {
        const response = await fetch(`${API_URL}/log-in-institution`, {
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
        console.error("Failed to login institution:", error);
        throw error;
    }
};




