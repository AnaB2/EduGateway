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
                const data = await getOpportunitiesByInstitutionEmail(email);
                console.log('Data received:', data); // Verificar los datos recibidos
                setOportunidades(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener las oportunidades:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [email]);

    async function actualizarOportunidades() {
        try {
            const data = await getOpportunitiesByInstitutionEmail(email);
            console.log('Updated data received:', data); // Verificar los datos actualizados
            setOportunidades(data);
        } catch (error) {
            console.error('Error al actualizar las oportunidades:', error);
            setError(error);
        }
    }

    if (loading) {
        return <p>Cargando oportunidades...</p>;
    }

    if (error) {
        return <p>Error al cargar oportunidades: {error.message}</p>;
    }

    return (
        <>
            <div className="contenedor-oportunidades">
                {oportunidades.length > 0 ? (
                    oportunidades.map((oportunidad) => (
                        <CardOportunidadInstitucion
                            key={oportunidad.id}
                            oportunidad={oportunidad}
                            actualizarOportunidades={actualizarOportunidades}
                        />
                    ))
                ) : (
                    <p>No se encontraron oportunidades.</p>
                )}
            </div>
            <AgregarOportunidad actualizarOportunidades={actualizarOportunidades} />
        </>
    );
}
