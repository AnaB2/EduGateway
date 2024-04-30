import {getToken, getUserType} from "../../../services/storage";
import {mostrarAlertaAutenticacion} from "../../../components/AlertaAutenticacion";
import {NavbarParticipante} from "../../../components/navbars/NavbarParticipante";
import {useNavigate} from "react-router";
import {ContenedorOportunidadesParticipante} from "../../../components/oportunidades/participante/ContenedorOportunidadesParticipante";

export function VerOportunidades(){

    const navigate = useNavigate()

    if (!getToken() || getUserType()!=="participant"){
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        )
    }
    return(
        <>
            <NavbarParticipante></NavbarParticipante>
            <div className="contenido-pagina">
                <h1>Ver oportunidades</h1>
                <ContenedorOportunidadesParticipante/>
            </div>
        </>
    )
}