import {useNavigate} from 'react-router-dom';
import {Registro} from "../../components/componentes-registro/Registro/Registro";
import {Login} from "../../components/componentes_inicio/Login/Login";

export function Inicio(){

    const navigate = useNavigate()
    //const irARuta = (ruta) => navigate('/registro-participante')

    return(
        <div>
            <h1>Inicio</h1>
            <Registro/>
            <Login/>
            </div>
)
}