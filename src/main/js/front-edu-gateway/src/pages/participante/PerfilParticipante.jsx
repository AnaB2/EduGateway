import {getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {useNavigate} from "react-router";
import {EditarPerfilParticipante} from "../../components/perfiles/participante/EditarPerfilParticipante";


export function PerfilParticipante(){

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
                <h1></h1>
                <EditarPerfilParticipante/>
            </div>
        </>
    )
}