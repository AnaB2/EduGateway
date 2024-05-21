import {getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {useNavigate} from "react-router";
import {ContenedorOportunidadesParticipante} from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";

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
            <div className="contenido-pagina-oportunidades">
                <h1>Ver oportunidades</h1>
                <ContenedorOportunidadesParticipante/>
            </div>
        </>
    )
}