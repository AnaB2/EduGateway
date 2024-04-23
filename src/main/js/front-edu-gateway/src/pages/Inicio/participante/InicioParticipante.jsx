import {getToken, getUserType} from "../../../services/storage";
import {NavbarParticipante} from "../../../components/navbars/NavbarParticipante";
import {mostrarAlertaAutenticacion} from "../../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";

export function InicioParticipante(){
    const navigate = useNavigate()

    if (!getToken() || getUserType()!=="participant"){
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        )
    }
    return(
        <div>
            <NavbarParticipante></NavbarParticipante>
            <div className="contenido-pagina">
                <h1>Inicio participante</h1>
            </div>
        </div>
    )

}