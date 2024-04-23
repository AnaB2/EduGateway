//import {useNavigate} from 'react-router-dom';
import {Registro} from "../../components/componentesSignup/Registro";
import {Login} from "../../components/componentesLogin/Login";

export function Inicio(){

    //const navigate = useNavigate()
    //const irARuta = (ruta) => navigate('/registro-participante')

    return(
        <div className="inicio">
            <h1>Inicio</h1>
            <Registro/>
            <Login/>
        </div>
)
}