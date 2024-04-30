import { getEmail } from "../../../services/storage";
import { useEffect, useState } from "react";
import { getOpportunitiesByInstitution } from "../../../services/Api";
import { CardOportunidadInstitucion } from "./CardOportunidadInstitucion";
import {AgregarOportunidad} from "./AgregarOportunidad";

export function ContenedorOportunidadesInstitucion() {
    const email = getEmail();
    const [oportunidades, setOportunidades] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await getOpportunitiesByInstitution(email);
                setOportunidades(response);
            } catch (error) {
                console.error('Error al obtener las oportunidades:', error);
            }
        };

        fetchOpportunities();
    }, [email]);

    async function actualizarOportunidades(){
        const actualizarOportunidades = await getOpportunitiesByInstitution(email);
        setOportunidades(actualizarOportunidades)
    }

    return (
        <>
            <div className="contenedor-oportunidades">
                {oportunidades.map((oportunidad) => (<CardOportunidadInstitucion key={oportunidad.id} oportunidad={oportunidad} actualizarOportunidades={()=>actualizarOportunidades()}/>))}
            </div>
            <AgregarOportunidad actualizarOportunidades={()=>actualizarOportunidades()}/>
        </>


    );
}
