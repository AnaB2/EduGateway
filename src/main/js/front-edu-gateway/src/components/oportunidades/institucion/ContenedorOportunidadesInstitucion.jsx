import { getEmail } from "../../../services/storage";
import { useEffect, useState } from "react";
import { getOpportunitiesByInstitutionEmail } from "../../../services/Api";
import { CardOportunidadInstitucion } from "./CardOportunidadInstitucion";
import { AgregarOportunidad } from "./AgregarOportunidad";

export function ContenedorOportunidadesInstitucion() {
    const email = getEmail();
    const [oportunidades, setOportunidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                const data = await getOpportunitiesByInstitutionEmail(email);
                console.log('Data received:', data);
                setOportunidades(data);
                setError(null);
            } catch (error) {
                console.error('Error al obtener las oportunidades:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [email]);

    async function actualizarOportunidades() {
        try {
            setLoading(true);
            const data = await getOpportunitiesByInstitutionEmail(email);
            console.log('Updated data received:', data);
            setOportunidades(data);
            setError(null);
        } catch (error) {
            console.error('Error al actualizar las oportunidades:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando oportunidades...</span>
                </div>
                <div className="loading-text">Cargando tus oportunidades...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                </svg>
                <h3>Error al cargar oportunidades</h3>
                <p>Ocurrió un problema al cargar tus oportunidades. Por favor, intenta nuevamente.</p>
            </div>
        );
    }

    return (
        <>
            {oportunidades.length > 0 ? (
                <div className="contenedor-oportunidades">
                    {oportunidades.map((oportunidad) => (
                        <CardOportunidadInstitucion
                            key={oportunidad.id}
                            oportunidad={oportunidad}
                            actualizarOportunidades={actualizarOportunidades}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M6 9a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 9zM3.854 4.146a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z"/>
                        <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 0-1-1V3a1 1 0 0 1 1-1h12z"/>
                    </svg>
                    <h3>¡Comienza a crear oportunidades!</h3>
                    <p>
                        Aún no has creado ninguna oportunidad educativa. 
                        Crea tu primera oportunidad para conectar con estudiantes talentosos.
                    </p>
                </div>
            )}
            
            <AgregarOportunidad 
                actualizarOportunidades={actualizarOportunidades} 
                className="btn-add-opportunity"
            />
        </>
    );
}
