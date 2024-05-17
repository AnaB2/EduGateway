import {getToken, getUserType} from "../../../services/storage";
import {mostrarAlertaAutenticacion} from "../../../components/AlertaAutenticacion";
import {NavbarParticipante} from "../../../components/navbars/NavbarParticipante";
import {useNavigate} from "react-router";
import {EditarPerfilInstitucion} from "../../../components/perfiles/institucion/EditarPerfilInstitucion";


export function PerfilInstitucion(){

    const navigate = useNavigate()

    if (!getToken() || getUserType()!=="institution"){
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
                <EditarPerfilInstitucion/>
            </div>
        </>
    )
}