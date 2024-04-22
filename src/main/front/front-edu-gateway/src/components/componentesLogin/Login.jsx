import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../services/auth";
import Button from "react-bootstrap/Button";

export function Login(){

    // Controles del modal
    const[visible, setVisible] = useState(false);
    const cerrar = () => {
        setVisible(false)
        setLoginError('')
    };
    const abrir = () => setVisible(true);

    // Objeto navegación
    const navigate = useNavigate()

    // Controles de respuesta de form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false); // true o false
    const [loginError, setLoginError] = useState(''); // indica error en caso de error

    // Función que se ejecuta al presionar boton de envío, y que llama a función loginUser en auth.js
    async function enviarForm(){
        try{
            const userData = {email: email, password: password}
            await loginUser(userData, navigate)
            setLoginSuccess(true)
            setLoginError('')
        }catch (error){
            console.error("Error en login: ", error) // ¿console log? ¿es buena práctica?
            setLoginSuccess(false)
            setLoginError("Correo electrónico o contraseña incorrectos")
        }
    }

    return(
        <>
            <Button variant="dark" onClick={abrir}>Iniciar sesión</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Iniciar sesión</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <>
                        <FloatingLabel controlId="floatingInput" label="Correo electrónico" className="mb-3">
                            <Form.Control type="email" placeholder="nombre@ejemplo.com" onChange={(event)=>{setEmail(event.target.value)}}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Contraseña">
                            <Form.Control type="password" placeholder="Contraseña" onChange={(event)=>{setPassword(event.target.value)}}/>
                        </FloatingLabel>
                    </>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="success" onClick={enviarForm}>Iniciar sesión</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                    {loginError!=='' && <p style={{ color: 'red', marginTop: 10 }}>{loginError}</p>}
                    {loginSuccess && <p style={{ marginTop: 10 }}>Inicio de sesión exitoso</p>}
                </Modal.Footer>
            </Modal>
        </>
    )
}