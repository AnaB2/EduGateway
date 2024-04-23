import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {signUpUser} from '../../services/register.js';
import {useNavigate} from "react-router";
import {useState} from "react";


export function FormularioRegistroParticipante(){

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const [mensaje, setMensaje] = useState(<></>);

    // obtenemos objeto de navegación
    const navigate = useNavigate()

    async function enviarForm(){
        try {
            const userData = {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            };
            await signUpUser(userData);
            setSignUpSuccess(true);
            setMensaje(<p style={{ marginTop: 20 }}>Registro exitoso</p>)
            navigate('/')
        }
        catch (error){
            setMensaje(<p style={{ marginTop: 20, color:'red'}}>Error de registro</p>)
            console.error("Error de registro: ", error);
        }
    }

    return(
        <div>
            <div className="form-registro">
                <FloatingLabel controlId="floatingInput" label="Nombre" className="mb-3">
                    <Form.Control type="name" placeholder="Nombre" onChange={(event)=>{setFirstName(event.target.value)}}/>
                </FloatingLabel>

                <FloatingLabel controlId="floatingInput" label="Apellido" className="mb-3">
                    <Form.Control type="name" placeholder="Apellido" onChange={(event)=>{setLastName(event.target.value)}}/>
                </FloatingLabel>

                <FloatingLabel controlId="floatingInput" label="Correo electrónico" className="mb-3">
                    <Form.Control type="email" placeholder="nombre@ejemplo.com" onChange={(event)=>{setEmail(event.target.value)}}/>
                </FloatingLabel>

                <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
                    <Form.Control type="password" placeholder="Contraseña" onChange={(event)=>{setPassword(event.target.value)}}/>
                </FloatingLabel>
            </div>
            <div>
                <Button variant="dark" onClick={enviarForm}>Registrarse</Button>
                {mensaje}
            </div>
        </div>
    )
}