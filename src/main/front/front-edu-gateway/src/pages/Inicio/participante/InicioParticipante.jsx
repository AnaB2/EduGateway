import {useNavigate} from "react-router-dom";
import {getToken, getUserType} from "../../services/storage";
import {NavbarParticipante} from "../../components/navbars/NavbarParticipante";

export function InicioParticipante(){

    const navigate = useNavigate();

    if (!getToken() || getUserType()!="participant"){
        return(
            <h1>Error de autenticación</h1>
        )
        navigate('/')
    }
    return(
        <NavbarParticipante></NavbarParticipante>
    )

}