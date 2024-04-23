import {getToken, getUserType} from "../../../services/storage";
import {NavbarInstitucion} from "../../../components/navbars/NavbarInstitucion";
import {mostrarAlertaAutenticacion} from "../../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";

export function GestionarOportunidades(){
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
            <h1>Gestionar oportunidades</h1>
        </>
    )
}