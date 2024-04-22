import {NavbarInstitucion} from "../../components/navbars/NavbarInstitucion";
import {useNavigate} from "react-router-dom";
import {getToken, getUserType} from "../../services/storage";
import {NavbarParticipante} from "../../components/navbars/NavbarParticipante";

export function InicioInstitucion(){

    const navigate = useNavigate();

    if (!getToken() || getUserType()!="institution"){
        return(
            <h1>Error de autenticación</h1>
        )
        navigate('/')
    }
    return(
        <NavbarInstitucion></NavbarInstitucion>
    )

}