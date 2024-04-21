import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useState} from "react";
import {useNavigate} from "react-router";
import {signUpInstitution} from "../../../services/register";
import Button from "react-bootstrap/Button";


export function FormularioRegistroInstitucion(){

    const [institutionName, setInstitutionName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credential, setCredential] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const [mensaje, setMensaje] = useState(<></>);

    // obtenemos objeto de navegación
    const navigate = useNavigate();

    async function enviarForm(){
        try {
            const institutionData = {
                email: email,
                password: password,
                institutionalName: institutionName,
                credential: credential
            };
            await signUpInstitution(institutionData);
            setSignUpSuccess(true);
            setMensaje(<p style={{ marginTop: 20 }}>Registro exitoso</p>)
            navigate('/');
        }
        catch (error){
            setMensaje(<p style={{ marginTop: 20, color:'red'}}>Error de registro</p>)
            console.error("Error de registro: ", error);
        }
    }

    return(
        <div className="form-registro">
            <FloatingLabel controlId="floatingInput" label="Nombre institucional" className="mb-3">
                <Form.Control type="name" placeholder="Nombre" onChange={(event)=>{setInstitutionName(event.target.value)}}/>
            </FloatingLabel>

            <FloatingLabel controlId="floatingInput" label="Correo electrónico" className="mb-3">
                <Form.Control type="email" placeholder="nombre@ejemplo.com" onChange={(event)=>{setEmail(event.target.value)}}/>
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Contraseña">
                <Form.Control type="password" placeholder="Contraseña" onChange={(event)=>{setPassword(event.target.value)}}/>
            </FloatingLabel>

            <FloatingLabel controlId="floatingInput" label="Credencial" className="mb-3">
                <Form.Control placeholder="Credencial" onChange={(event)=>{setCredential(event.target.value)}}/>
            </FloatingLabel>

            <Button variant="dark" onClick={enviarForm}>Registrarse</Button>
            {mensaje}
        </div>

    )
}