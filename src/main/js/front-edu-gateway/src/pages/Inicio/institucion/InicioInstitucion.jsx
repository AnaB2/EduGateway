import {NavbarInstitucion} from "../../../components/navbars/NavbarInstitucion";
import {getToken, getUserType} from "../../../services/storage";
import {mostrarAlertaAutenticacion} from "../../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";

export function InicioInstitucion(){

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
            <h1>Inicio institucion</h1>
        </>
    )

}