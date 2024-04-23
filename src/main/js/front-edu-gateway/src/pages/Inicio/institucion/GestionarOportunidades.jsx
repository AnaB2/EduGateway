import {getToken, getUserType} from "../../../services/storage";
import {NavbarInstitucion} from "../../../components/navbars/NavbarInstitucion";
import {mostrarAlertaAutenticacion} from "../../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";
import {AgregarOportunidad} from "../../../components/oportunidades/AgregarOportunidad";
import {ContenedorOportunidades} from "../../../components/oportunidades/ContenedorOportunidades";

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
            <div className="contenido-pagina">
                <h1>Gestionar oportunidades</h1>
                <ContenedorOportunidades/>
            </div>
        </>
    )
}