import { useEffect, useState } from "react";
import {CardOportunidadParticipante} from "./CardOportunidadParticipante";
import {getOpportunities} from "../../../services/Api";

export function ContenedorOportunidadesParticipante({institutionEmail}) {

    const [oportunidades, setOportunidades] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await getOpportunities();
                !institutionEmail ? setOportunidades(response) : setOportunidades(response.filter(oportunidad => oportunidad.institutionEmail === institutionEmail));
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
                {oportunidades.map((oportunidad) => (<CardOportunidadParticipante mostrarLink={!institutionEmail} key={oportunidad.id} oportunidad={oportunidad} actualizarOportunidades={()=>actualizarOportunidades()}/>))}
            </div>
        </>


    );
}
