//import {useNavigate} from 'react-router-dom';
import {Registro} from "../../components/componentesSignup/Registro";
import {Login} from "../../components/componentesLogin/Login";

export function Inicio(){

    //const navigate = useNavigate()
    //const irARuta = (ruta) => navigate('/registro-participante')

    return(
        <div className="inicio">
            <div className="presentacion">
                <h1 style={{ color: "white", fontSize: "30px" }}>EduGateway</h1>
                <div className="botones-inicio">
                    <Registro/>
                    <Login/>
                </div>
            </div>
        </div>
    )
}