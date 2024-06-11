import { getEmail, getId, getToken } from "./storage";

const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

const addAuthorizationHeader = (headers) => {
    const token = getToken();
    const email = getEmail();

    if (!token || !email) {
        throw new Error('Token o correo no encontrados.');
    }

    return {
        ...headers,
        Authorization: token,
        Email: email,
    };
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

export async function getOpportunitiesByInstitution(name) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ InstitutionName: name }).toString();

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

export async function getOpportunitiesByCategory(category) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ category }).toString();

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

export async function getOpportunitiesByName(name) {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const queryParams = new URLSearchParams({ name }).toString();

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

export async function getOpportunities() {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API_URL}/get-opportunities`, {
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

export async function getFollowedInstitutions() {
    try {
        const headers = addAuthorizationHeader({
            'Content-Type': 'application/json',
        });

        const userId = getId();

        const response = await fetch(`${API_URL}/get-followed-institutions-by-user/${userId}`, {
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
            body: JSON.stringify({ userId, institutionId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to follow institution:", error);
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
