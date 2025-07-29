import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Spinner, Alert } from "react-bootstrap";
import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { EditarPerfilParticipante } from "../../components/perfiles/participante/EditarPerfilParticipante";
import { EliminarPerfilParticipante } from "../../components/perfiles/participante/EliminarPerfilParticipante";
import { getUserData, getUserHistory, updateUserTags } from "../../services/Api";
import { VerHistorialParticipante } from "../../components/perfiles/participante/VerHistorialParticipante";

const allTags = [
    "Programación", "Matemáticas", "Ciencia", "Literatura", "Idiomas",
    "Arte", "Música", "Negocios", "Salud", "Deportes", "Tecnología", "Universidad"
];

export function PerfilParticipante() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData(getEmail());
                setUserData(data[0]);

                // Ensure preferredTags is an array
                const tags = Array.isArray(data[0].preferredTags) ? data[0].preferredTags : [];
                setSelectedTags(tags);
            } catch (error) {
                setError("Error loading profile data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserHistory = async () => {
            try {
                const data = await getUserHistory(getEmail());
                setInscriptions(data);
            } catch (error) {
                console.error("Error loading history:", error);
            }
        };

        fetchUserData();
        fetchUserHistory();
    }, []);

    const handleTagSelection = (tag) => {
        setSelectedTags(selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag]);
    };

    const handleSaveTags = useCallback(async () => {
        setSaving(true);
        try {
            await updateUserTags(getEmail(), selectedTags);
            alert("Preferencias actualizadas correctamente");
        } catch (error) {
            console.error("Error updating tags:", error);
            alert("Error al actualizar las preferencias.");
        } finally {
            setSaving(false);
        }
    }, [selectedTags]);

    if (!getToken() || getUserType() !== "participant") {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    if (loading) {
        return (
            <>
                <NavbarParticipante />
                <div className="profile-page">
                    <div className="profile-loading">
                        <Spinner animation="border" />
                        <p>Cargando tu perfil...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavbarParticipante />
                <div className="profile-page">
                    <div className="profile-error">
                        <h3>❌ Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarParticipante />
            <div className="profile-page">
                <div className="profile-container">
                    {/* Header */}
                    <div className="profile-header">
                        <h1>Perfil del Participante</h1>
                        <p className="profile-subtitle">
                            Gestiona tu información personal y preferencias de aprendizaje
                        </p>
                        
                        <div className="profile-info-grid">
                            <div className="profile-info-card">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">👤</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Nombre</div>
                                        <div className="profile-info-value">{userData.firstName}</div>
                                    </div>
                                </div>
                                
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">👤</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Apellido</div>
                                        <div className="profile-info-value">{userData.lastName}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="profile-info-card">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">📧</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Correo</div>
                                        <div className="profile-info-value">{userData.email}</div>
                                    </div>
                                </div>
                                
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">📝</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Descripción</div>
                                        <div className="profile-info-value">
                                            {userData.description || "No hay descripción disponible"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="preferences-section">
                        <h3>Preferencias de Interés</h3>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Selecciona los temas que más te interesan para recibir recomendaciones personalizadas
                        </p>
                        
                        <div className="tags-grid">
                            {allTags.map(tag => (
                                <div 
                                    key={tag} 
                                    className={`tag-item ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                    onClick={() => handleTagSelection(tag)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => handleTagSelection(tag)}
                                    />
                                    <label>{tag}</label>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            className="save-preferences-btn"
                            onClick={handleSaveTags}
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar Preferencias"}
                        </button>
                    </div>

                    {/* Actions Section */}
                    <div className="profile-actions">
                        <h3>Acciones de Perfil</h3>
                        <div className="actions-grid">
                            <EditarPerfilParticipante 
                                actualizarParticipante={() => {
                                    getUserData(getEmail()).then(data => setUserData(data[0]));
                                }} 
                                datosAnteriores={userData}
                                className="action-button action-button-primary"
                            />
                            
                            <VerHistorialParticipante 
                                inscriptions={inscriptions}
                                className="action-button action-button-secondary"
                            />
                            
                            <EliminarPerfilParticipante 
                                actualizarParticipante={() => navigate("/")}
                                email={userData.email}
                                className="action-button action-button-danger"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
