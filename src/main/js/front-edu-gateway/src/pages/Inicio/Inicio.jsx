//import {useNavigate} from 'react-router-dom';
import {ModalRegistro} from "../../components/signup/ModalRegistro";
import {LoginModal} from "../../components/login/LoginModal";

export function Inicio(){

    //const navigate = useNavigate()
    //const irARuta = (ruta) => navigate('/registro-participante')

    return(
        <div className="inicio">
            <div className="presentacion">
                <h1 style={{ color: "white", fontSize: "30px" }}>EduGateway</h1>
                <div className="botones-inicio">
                    <ModalRegistro/>
                    <LoginModal/>
                </div>
            </div>
        </div>
    )
}