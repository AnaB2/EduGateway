import {getToken, getUserType} from "../../../services/storage";
import {NavbarParticipante} from "../../../components/navbars/NavbarParticipante";
import {mostrarAlertaAutenticacion} from "../../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";

export function InicioParticipante(){
    const navigate = useNavigate()

    if (!getToken() || getUserType()!=="participante"){
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

            </div>
        </>
    )

}