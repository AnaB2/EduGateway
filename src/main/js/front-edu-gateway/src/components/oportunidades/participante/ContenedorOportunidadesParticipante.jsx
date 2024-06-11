import { useEffect, useState } from "react";
import {CardOportunidadParticipante} from "./CardOportunidadParticipante";
import {getOpportunities} from "../../../services/Api";

export function ContenedorOportunidadesParticipante({
                                                        institutionEmail,
                                                        oportunidades,
                                                    }) {

    async function actualizarOportunidades() {
        try {
            const response = await getOpportunities();
            //setOportunidades(response);
        } catch (error) {
            console.error('Error al actualizar las oportunidades:', error);
        }
    }

    return (
        <div className="contenedor-oportunidades">
            {oportunidades?.map((oportunidad) => (
                <CardOportunidadParticipante mostrarLink={!institutionEmail} key={oportunidad.id}
                                             oportunidad={oportunidad}
                                             actualizarOportunidades={() => actualizarOportunidades()}/>))}
        </div>
    );
}