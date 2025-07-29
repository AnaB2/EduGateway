import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Spinner, Alert } from "react-bootstrap";
import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarInstitucion } from "../../components/navbar/NavbarInstitucion";
import { EditarPerfilInstitucion } from "../../components/perfiles/institucion/EditarPerfilInstitucion";
import { EliminarPerfilInstitucion } from "../../components/perfiles/institucion/EliminarPerfilInstitucion";
import { getInstitutionData, getInstitutionHistory } from "../../services/Api";
import { VerHistorialInstitucion } from "../../components/perfiles/institucion/VerHistorialInstitucion";

export function PerfilInstitucion() {
    const navigate = useNavigate();
    const [institutionData, setInstitutionData] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstitutionData = async () => {
            try {
                const data = await getInstitutionData(getEmail());
                setInstitutionData(data[0]);
            } catch (error) {
                setError("Error al cargar los datos de la institución.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchInstitutionHistory = async () => {
            try {
                const data = await getInstitutionHistory(getEmail());
                setOpportunities(data);
            } catch (error) {
                console.error("Error al cargar el historial:", error);
            }
        };

        fetchInstitutionData();
        fetchInstitutionHistory();
    }, []);

    if (!getToken() || getUserType() !== "institution") {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    if (loading) {
        return (
            <>
                <NavbarInstitucion />
                <div className="profile-page">
                    <div className="profile-loading">
                        <Spinner animation="border" />
                        <p>Cargando perfil de la institución...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavbarInstitucion />
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
            <NavbarInstitucion />
            <div className="profile-page">
                <div className="profile-container">
                    {/* Header */}
                    <div className="profile-header institution-profile-header">
                        <h1>Perfil de la Institución</h1>
                        <p className="profile-subtitle">
                            Administra la información de tu institución y revisa tu historial de oportunidades
                        </p>
                        
                        <div className="profile-info-grid">
                            <div className="profile-info-card">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">🏢</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Nombre Institucional</div>
                                        <div className="profile-info-value">{institutionData.institutionalName}</div>
                                    </div>
                                </div>
                                
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">📧</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Correo Institucional</div>
                                        <div className="profile-info-value">{institutionData.email}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="profile-info-card">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">📝</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Descripción</div>
                                        <div className="profile-info-value">
                                            {institutionData.description || "No hay descripción disponible."}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">📊</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Oportunidades Creadas</div>
                                        <div className="profile-info-value">
                                            {opportunities.length} oportunidades en el historial
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="preferences-section">
                        <h3>📈 Estadísticas de la Institución</h3>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Resumen de la actividad y alcance de tu institución en la plataforma
                        </p>
                        
                        <div className="profile-info-grid">
                            <div className="profile-info-card">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">🎯</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Total de Oportunidades</div>
                                        <div className="profile-info-value" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366f1' }}>
                                            {opportunities.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="profile-info-card">
                                <div className="profile-info-item">
                                    <div className="profile-info-icon">📅</div>
                                    <div className="profile-info-content">
                                        <div className="profile-info-label">Miembro desde</div>
                                        <div className="profile-info-value" style={{ fontSize: '1.1rem', color: '#10b981' }}>
                                            {institutionData.createdAt ? 
                                                new Date(institutionData.createdAt).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 
                                                "Fecha no disponible"
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="profile-actions">
                        <h3>Acciones de Perfil</h3>
                        <div className="actions-grid">
                            <EditarPerfilInstitucion 
                                actualizarInstitucion={() => {
                                    getInstitutionData(getEmail()).then(data => setInstitutionData(data[0]));
                                }} 
                                datosAnteriores={institutionData}
                                className="action-button action-button-primary"
                            />
                            
                            <VerHistorialInstitucion 
                                opportunities={opportunities}
                                className="action-button action-button-secondary"
                            />
                            
                            <EliminarPerfilInstitucion 
                                actualizarInstitucion={() => navigate("/")} 
                                email={institutionData.email}
                                className="action-button action-button-danger"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
