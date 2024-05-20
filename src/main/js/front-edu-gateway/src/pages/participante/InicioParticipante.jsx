import {getName, getToken, getUserType} from "../../services/storage";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";
import Portada from "../../components/inicio/Portada";

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
            <Portada img_path={"/img/portada_participante.png"} nombre={getName()}/>gi
        </div>
    )

}