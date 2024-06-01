import {useLocation} from "react-router";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {
    ContenedorOportunidadesInstitucion
} from "../../components/oportunidades/institucion/ContenedorOportunidadesInstitucion";
import {
    ContenedorOportunidadesParticipante
} from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";

export function PerfilPublicoInstitucion(){

    // PERFIL DE INSTITUCIÓN QUE VAN A VER LOS PARTICIPANTES

    const location = useLocation();
    const institutionData = location.state;
    console.log(institutionData);

    return(
        <>
            <NavbarParticipante/>
            <div className="contenido-pagina-perfil-publico">
                {institutionData ? (
                    <div>
                        <div className={"datos-perfil-publico"}>
                            <h1>{institutionData.institutionalName.toUpperCase()}</h1>
                            <div>
                                <p>Correo:</p>
                                <p>{institutionData.email}</p>
                            </div>
                        </div>
                        <div className={"contenido-pagina-oportunidades"}>
                            <ContenedorOportunidadesParticipante institutionEmail={institutionData.email}/>
                        </div>
                    </div>

                ) : (
                    <p>Cargando datos del perfil...</p>
                )}
            </div>
        </>
    )
}