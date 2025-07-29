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

    console.log("🔐 Debug authorization - Token:", token ? "Present" : "Missing");
    console.log("🔐 Debug authorization - Email:", email);

    if (!token || !email) {
        console.error("❌ Authorization failed - Token or email missing");
        throw new Error('Token or email not found.');
    }

    // Agregar "Bearer " al token si no lo tiene ya
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    console.log("🔐 Formatted token:", formattedToken.substring(0, 20) + "...");

    return {...headers, Authorization: formattedToken, Email: email,};
};

// WebSocket singleton management
let globalWebSocket = null;
let globalMessageHandlers = [];
let isConnecting = false;

// Initialize WebSocket connection
export const initializeWebSocket = (onMessageReceived) => {
    // Add the message handler to the global list
    if (onMessageReceived && !globalMessageHandlers.includes(onMessageReceived)) {
        globalMessageHandlers.push(onMessageReceived);
    }
    
    // If we already have an active connection, just add the handler
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected, adding message handler");
        return globalWebSocket;
    }
    
    // If we're already connecting, wait for it
    if (isConnecting) {
        console.log("WebSocket connection in progress, handler added to queue");
        return;
    }
    
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 5000;
    const PING_INTERVAL = 25000;
    let pingInterval;

    const connect = () => {
        isConnecting = true;
        
        // Create WebSocket URL - ensure we use ws:// protocol
        const wsUrl = API_URL.replace('http://', 'ws://').replace('https://', 'wss://');
        console.log("Connecting to WebSocket:", `${wsUrl}/notifications`);
        
        globalWebSocket = new WebSocket(`${wsUrl}/notifications`);

        globalWebSocket.onopen = () => {
            console.log("WebSocket connection opened successfully");
            isConnecting = false;
            reconnectAttempts = 0;

            // Send initial message based on user type
            try {
                const message = JSON.stringify(
                    getUserType() === "participant"
                        ? { userId: getId() }
                        : { institutionId: getId() }
                );
                console.log("Sending registration message:", message);
                globalWebSocket.send(message);
            } catch (error) {
                console.error("Error sending registration message:", error);
            }

            // Start heartbeat
            pingInterval = setInterval(() => {
                if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
                    globalWebSocket.send(JSON.stringify({ type: "ping" }));
                }
            }, PING_INTERVAL);
        };

        globalWebSocket.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
            // Send message to all registered handlers
            globalMessageHandlers.forEach(handler => {
                try {
                    if (handler) handler(event.data);
                } catch (error) {
                    console.error("Error in message handler:", error);
                }
            });
        };

        globalWebSocket.onclose = (event) => {
            console.log("WebSocket connection closed:", event.code, event.reason);
            isConnecting = false;
            clearInterval(pingInterval);
            
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
                setTimeout(() => {
                    reconnectAttempts++;
                    connect();
                }, RECONNECT_DELAY);
            } else {
                console.error("Max WebSocket reconnect attempts reached.");
                globalWebSocket = null;
            }
        };

        globalWebSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
            isConnecting = false;
        };
    };

    connect();
    return globalWebSocket;
};

// Function to remove message handlers (useful for cleanup)
export const removeWebSocketHandler = (handler) => {
    const index = globalMessageHandlers.indexOf(handler);
    if (index > -1) {
        globalMessageHandlers.splice(index, 1);
    }
};

// Function to get current WebSocket status
export const getWebSocketStatus = () => {
    if (!globalWebSocket) return 'DISCONNECTED';
    switch (globalWebSocket.readyState) {
        case WebSocket.CONNECTING: return 'CONNECTING';
        case WebSocket.OPEN: return 'OPEN';
        case WebSocket.CLOSING: return 'CLOSING';
        case WebSocket.CLOSED: return 'CLOSED';
        default: return 'UNKNOWN';
    }
};

export const addOpportunity = async (opportunityData) => {
    try {
        console.log("🚀 Attempting to add opportunity:", opportunityData);
        
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        console.log("🔐 Headers being sent:", headers);

        const response = await fetch(`${API_URL}/add-opportunity`, {
            method: 'POST',
            headers,
            body: JSON.stringify(opportunityData),
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response statusText:", response.statusText);

        if (response.status === 401) {
            const errorText = await response.text();
            console.error("❌ 401 Unauthorized - Backend response:", errorText);
            throw new Error('Unauthorized access');
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Network error - Backend response:", errorText);
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log("✅ Success - Backend response:", result);
        return result;
    } catch (error) {
        console.error("💥 Failed to add opportunity:", error);
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

        const data = await response.json();
        console.log("💬 Chat creation response:", data);
        
        return {
            chatId: data.chatId,
            existed: data.existed,
            message: data.message
        };
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

// ===== NOTIFICATION FUNCTIONS =====

// Obtener notificaciones del usuario
export const getUserNotifications = async (userId) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/notifications/user?userId=${userId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user notifications');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get user notifications:", error);
        throw error;
    }
};

// Obtener notificaciones de la institución
export const getInstitutionNotifications = async (institutionId) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/notifications/institution?institutionId=${institutionId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch institution notifications');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to get institution notifications:", error);
        throw error;
    }
};

// Obtener contador de notificaciones no leídas
export const getUnreadNotificationCount = async () => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const userType = getUserType();
        const id = getId();
        const param = userType === "participant" ? `userId=${id}` : `institutionId=${id}`;

        const response = await fetch(`${API_URL}/notifications/unread-count?${param}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch unread count');
        }

        const data = await response.json();
        return data.unreadCount;
    } catch (error) {
        console.error("Failed to get unread notification count:", error);
        return 0;
    }
};

// Marcar notificación como leída
export const markNotificationAsRead = async (notificationId) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/notifications/mark-read`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ notificationId: notificationId.toString() }),
        });

        if (!response.ok) {
            throw new Error('Failed to mark notification as read');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
    }
};

// Marcar todas las notificaciones como leídas
export const markAllNotificationsAsRead = async () => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const userType = getUserType();
        const id = getId();
        const body = userType === "participant" 
            ? { userId: id.toString() } 
            : { institutionId: id.toString() };

        const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to mark all notifications as read');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        throw error;
    }
};

// Obtener notificaciones según el tipo de usuario
export const getNotifications = async () => {
    const userType = getUserType();
    const id = getId();
    
    if (userType === "participant") {
        return await getUserNotifications(id);
    } else {
        return await getInstitutionNotifications(id);
    }
};

export const getChatMessages = async (chatId) => {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/get-messages-by-chat`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ chatId: chatId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("💬 Chat messages response:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener mensajes del chat:", error);
        throw error;
    }
};

export const sendMessage = async (chatId, senderId, receiverId, content, receiverType) => {
    try {
        // Validar que todos los parámetros requeridos estén presentes
        if (!chatId || !senderId || !receiverId || !content || !receiverType) {
            throw new Error(`Missing required parameters: chatId=${chatId}, senderId=${senderId}, receiverId=${receiverId}, content=${content}, receiverType=${receiverType}`);
        }

        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/send-message`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ 
                chatId: chatId.toString(),
                sender: senderId.toString(),
                receiver: receiverId.toString(),
                content: content,
                receiverType: receiverType
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("💬 Message sent response:", data);
        return data;
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        throw error;
    }
};