import { getEmail } from "../../../services/storage";
import { useEffect, useState } from "react";
import {CardOportunidadParticipante} from "./CardOportunidadParticipante";
import {getOpportunities} from "../../../services/Api";

export function ContenedorOportunidadesParticipante() {
    const email = getEmail();
    const [oportunidades, setOportunidades] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await getOpportunities();
                console.log(response)
                setOportunidades(response);
            } catch (error) {
                console.error('Error al obtener las oportunidades:', error);
            }
        };
        fetchOpportunities();
    }, []);

    async function actualizarOportunidades() {
        try {
            const response = await getOpportunities();
            setOportunidades(response);
        } catch (error) {
            console.error('Error al actualizar las oportunidades:', error);
        }
    }

    return (
        <>
            <div className="contenedor-oportunidades">
                {oportunidades.map((oportunidad) => (<CardOportunidadParticipante key={oportunidad.id} oportunidad={oportunidad} actualizarOportunidades={()=>actualizarOportunidades()}/>))}
                {console.log(oportunidades)}
            </div>
        </>


    );
}
