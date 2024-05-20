import {NavbarInstitucion} from "../../components/navbar/NavbarInstitucion";
import {getName, getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";
import Portada from "../../components/inicio/Portada";

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
        <div className="fondo">
            <NavbarInstitucion></NavbarInstitucion>
            <Portada img_path={"/img/portada_institucion.png"} nombre={getName()}/>
        </div>
    )

}