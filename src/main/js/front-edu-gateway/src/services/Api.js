import {getEmail, getId, getToken, getUserType} from "./storage";
import axios from "axios";

const API_URL = 'http://localhost:4321'; // Backend base URL

// Mercado pago create preference
export const createPreference = async (price, name) => {
    try {
        const response = await axios.post(API_URL + "/create-preference",
            {
                title: name,
                price: price
            })
        return response.data // retorna preference id
    } catch (e) {
        console.log(e)
    }
}

export const saveDonation = async (userId, institutionId, amount) => {
    try {
        const response = await axios.post(`${API_URL}/donations`, {
            userId,
            institutionId,
            amount: Number(amount)
        });

        return response.data; // Retorna la respuesta si es necesario
    } catch (error) {
        console.error("Error al registrar la donación:", error);
        throw error;
    }
};

export const getSentDonations = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/donations/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener donaciones enviadas:", error);
        throw error;
    }
};

export const getReceivedDonations = async (institutionId) => {
    try {
        const response = await axios.get(`${API_URL}/donations/institution/${institutionId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener donaciones recibidas:", error);
        throw error;
    }
};

// Add authorization headers to API requests
const addAuthorizationHeader = (headers) => {
    const token = getToken();
    const email = getEmail();

    if (!token || !email) {
        throw new Error('Token or email not found.');
    }

    return {...headers, Authorization: token, Email: email,};
};

// Initialize WebSocket connection
export const initializeWebSocket = (onMessageReceived) => {
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 5000;
    const PING_INTERVAL = 25000;
    let pingInterval;

    const connect = () => {
        const socket = new WebSocket(`${API_URL}/notifications`);

        socket.onopen = () => {
            console.log("WebSocket connection opened");
            reconnectAttempts = 0;

            // Send initial message based on user type
            const message = JSON.stringify(
                getUserType() === "participant"
                    ? { userId: getId() }
                    : { institutionId: getId() }
            );
            socket.send(message);

            // Start heartbeat
            pingInterval = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: "ping" }));
                }
            }, PING_INTERVAL);
        };

        socket.onmessage = (event) => {
            if (onMessageReceived) onMessageReceived(event.data);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            clearInterval(pingInterval);
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                setTimeout(() => {
                    reconnectAttempts++;
                    connect();
                }, RECONNECT_DELAY);
            } else {
                console.error("Max WebSocket reconnect attempts reached.");
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    connect();
};

export const addOpportunity = async (opportunityData) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/add-opportunity`, {
            method: 'POST',
            headers,
            body: JSON.stringify(opportunityData),
        });

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
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/delete-opportunity`, {
            method: 'POST',
            headers,
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

export const modifyOpportunity = async (opportunityData, previousName) => {
    try {
        opportunityData.previousName = previousName;

        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/edit-opportunity`, {
            method: 'POST',
            headers,
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

export async function getOpportunitiesByInstitutionEmail(email) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ email }).toString();

        const response = await fetch(`${API_URL}/get-opportunities-institution?${queryParams}`, {
            method: 'GET',
            headers,
        });

        if (response.status === 401) {
            throw new Error('Unauthorized access');
        }
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Network response was not ok: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get opportunities by institution email:", error);
        throw error;
    }
}

export async function getOpportunitiesByInstitution(name, page = 1, size = 10) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ InstitutionName: name, page, size }).toString();

        const response = await fetch(`${API_URL}/filter-by-InstitutionName?${queryParams}`, {
            method: 'GET',
            headers,
        });

        if (response.status === 401) {
            throw new Error('Unauthorized access');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get opportunities by institution:", error);
        throw error;
    }
}

export async function getOpportunitiesByCategory(category, page = 1, size = 10) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ category, page, size }).toString();

        const response = await fetch(`${API_URL}/filter-by-category?${queryParams}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get opportunities by category:", error);
        throw error;
    }
}

export async function getOpportunitiesByName(name, page = 1, size = 10) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ name, page, size }).toString();

        const response = await fetch(`${API_URL}/filter-by-nameOpportunity?${queryParams}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get opportunities by name:", error);
        throw error;
    }
}


export async function getOpportunities(page = 1, size = 10) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/get-opportunities?page=${page}&size=${size}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get opportunities:", error);
        throw error;
    }
}


export async function getFollowedInstitutions(page = 1, size = 10) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const userId = getId();

        const response = await fetch(`${API_URL}/get-followed-institutions-by-user/${userId}?page=${page}&size=${size}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get followed institutions:", error);
        throw error;
    }
}

export async function getOpportunitiesFiltered(filters, page = 1, size = 10) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append("category", filters.category);
        if (filters.institution) queryParams.append("InstitutionName", filters.institution);
        if (filters.name) queryParams.append("name", filters.name);
        queryParams.append("followed", filters.followed);
        queryParams.append("userId", filters.userId || ""); // Si no hay usuario, enviamos vacío
        queryParams.append("page", page);
        queryParams.append("size", size);

        const response = await fetch(`${API_URL}/filter-opportunities?${queryParams.toString()}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return await response.json(); // Retorna un objeto con opportunities, totalResults y totalPages
    } catch (error) {
        console.error("Failed to get filtered opportunities:", error);
        throw error;
    }
}

export async function addInscription(email, opportunityId, formData) {
    try {
        const response = await fetch(`${API_URL}/add-inscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Email': email,
                'OpportunityId': opportunityId,
            },
            body: JSON.stringify(formData),
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

export async function getUserDetails(email) {
    const response = await fetch(`${API_URL}/api/users?email=${email}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

export async function getInscriptions() {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/get-inscriptions`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get inscriptions:", error);
        throw error;
    }
}

export async function approveInscription(inscriptionId) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/approve-inscription`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ inscriptionId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to approve inscription:", error);
        throw error;
    }
}

export async function rejectInscription(inscriptionId) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/reject-inscription`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ inscriptionId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to reject inscription:", error);
        throw error;
    }
}

export async function followInstitution(userId, institutionId) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/follow-institution`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ userId: userId.toString(), institutionId: institutionId.toString() }),
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to follow institution:", error);
        throw error;
    }
}

export async function unfollowInstitution(userId, institutionId) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/unfollow-institution`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ userId: userId.toString(), institutionId: institutionId.toString() }),
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to unfollow institution:", error);
        throw error;
    }
}

export async function isFollowingInstitution(userEmail, institutionEmail) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/is-following-institution`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ UserEmail: userEmail, InstitutionEmail: institutionEmail }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to check if user is following institution:", error);
        throw error;
    }
}

export const editUser = async (userData, previousEmail) => {
    try {
        userData.previousEmail = previousEmail;

        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/edit-user`, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to edit profile:", error);
        throw error;
    }
};

export const editInstitution = async (institutionData, previousEmail) => {
    try {
        institutionData.previousEmail = previousEmail;

        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/edit-institution`, {
            method: 'POST',
            headers,
            body: JSON.stringify(institutionData),
        });

        if (!response.ok) {
            throw new Error('Failed to edit institution profile: ' + await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to edit institution profile:", error);
        throw error;
    }
};

export const getInstitutionData = async (email) => {
    try {
        const response = await fetch(`${API_URL}/get-institution-data?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get institution data: ' + await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get institution data:", error);
        throw error;
    }
};

export const getUserData = async (email) => {
    try {
        const response = await fetch(`${API_URL}/get-user-data?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get user data: ' + await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get user data:", error);
        throw error;
    }
};

export const deleteUser = async (email) => {
    try {
        const response = await fetch(`${API_URL}/delete-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete user: ' + await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error;
    }
};

export const deleteInstitution = async (email) => {
    try {
        const response = await fetch(`${API_URL}/delete-institution`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete institution: ' + await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to delete institution:", error);
        throw error;
    }
};

export const getUserHistory = async (email) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ email }).toString();

        const response = await fetch(`${API_URL}/get-user-history?${queryParams}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get user history:", error);
        throw error;
    }
}

export const getInstitutionHistory = async (email) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ email }).toString();

        const response = await fetch(`${API_URL}/get-institution-history?${queryParams}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get institution history:", error);
        throw error;
    }
};

export async function createChat(emailDestino, id) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/create-chat`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email: emailDestino, userId: id }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return "OK";
    } catch (error) {
        console.error("Error al crear chat:", error);
        throw error;
    }
}

export const getListChats = async (id, userType) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });


        const body = userType === 'participant' ? JSON.stringify({ userId: id }) : JSON.stringify({ institutionId: id });

        const response = await fetch(`${API_URL}/get-chat-messages`, {
            method: 'POST',
            headers,
            body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Fallo obtener lista de chats", error);
        throw error;
    }
};

export async function getRecommendedOpportunities(userId) {
    try {
        const headers = addAuthorizationHeader({ 'Content-Type': 'application/json' });

        // ✅ Convertir userId a número para evitar errores en el backend
        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            throw new Error("User ID is not a valid number");
        }

        const response = await fetch(`${API_URL}/recommended-opportunities?userId=${parsedUserId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Server Error:", errorMessage);
            throw new Error("Network response was not ok: " + errorMessage);
        }

        const data = await response.json();
        console.log("Oportunidades obtenidas del backend:", data); // ✅ Verifica si el frontend recibe los datos
        return data;
    } catch (error) {
        console.error("Failed to get recommended opportunities:", error);
        throw error;
    }
}

export async function updateUserTags(email, tags) {
    try {
        const headers = addAuthorizationHeader({ 'Content-Type': 'application/json' });

        const response = await fetch(`${API_URL}/update-user-tags?email=${email}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ tags: Array.isArray(tags) ? tags : [] }), // ✅ Ensuring tags is always an array
        });

        if (!response.ok) {
            throw new Error("Failed to update tags");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating user tags:", error);
        throw error;
    }
}

export async function getOpportunityById(id) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/get-opportunity/${id}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get opportunity by id:", error);
        throw error;
    }
}
