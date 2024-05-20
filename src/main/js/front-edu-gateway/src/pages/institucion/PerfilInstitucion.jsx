import {getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";
import {EditarPerfilInstitucion} from "../../components/perfiles/institucion/EditarPerfilInstitucion";
import {NavbarInstitucion} from "../../components/navbar/NavbarInstitucion";


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
            <NavbarInstitucion></NavbarInstitucion>
            <div className="contenido-pagina">
                <h1></h1>
                <EditarPerfilInstitucion/>
            </div>
        </>
    )
}