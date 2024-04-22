import {useNavigate} from "react-router-dom";
import {getToken} from "../../services/storage";
import {NavbarParticipante} from "../../components/navbars/NavbarParticipante";

export function InicioParticipante(){

    const navigate = useNavigate();

    if (!getToken()){
        return(
            <h1>Error de autenticación</h1>
        )
        navigate('/')
    }
    return(
        <NavbarParticipante></NavbarParticipante>
    )

}