import {NavbarInstitucion} from "../../components/navbars/NavbarInstitucion";
import {useNavigate} from "react-router-dom";
import {getToken} from "../../services/storage";

export function InicioInstitucion(){

    const navigate = useNavigate();

    if (!getToken()){
        return(
            <h1>Error de autenticación</h1>
        )
        navigate('/')
    }
    return(
        <NavbarInstitucion></NavbarInstitucion>
    )

}