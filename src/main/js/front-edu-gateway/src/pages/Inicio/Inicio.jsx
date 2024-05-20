//import {useNavigate} from 'react-router-dom';
import {ModalRegistro} from "../../components/signup/ModalRegistro";
import {LoginModal} from "../../components/login/LoginModal";

export function Inicio(){

    //const navigate = useNavigate()
    //const irARuta = (ruta) => navigate('/registro-participante')

    return(
        <div className="inicio">
            <div className="presentacion">
                <img src={"/img/logo_blanco_sin_fondo.png"} style={{width:"20vw"}}/>
                <div className="botones-inicio">
                    <ModalRegistro/>
                    <LoginModal/>
                </div>
            </div>
        </div>
    )
}