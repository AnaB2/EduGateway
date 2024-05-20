import {logoutUser} from "../../services/auth";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";

export function LogoutButton(){
    const navigate = useNavigate();
    // Función que se ejecuta al presionar boton de envío, y que llama a función logout en auth.js
    async function logoutClick(){
        try{
            await logoutUser(navigate)
        }catch (error){
            console.error("Error en login: ", error)
        }
    }

    return(
        <Button variant="outline-primary" onClick={logoutClick}>Cerrar sesión</Button>
    )
}