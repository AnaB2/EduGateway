import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { signUpInstitution } from "../../services/register";
import Button from "react-bootstrap/Button";

export function FormularioRegistroInstitucion() {
    const [institutionName, setInstitutionName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credential, setCredential] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    async function enviarForm() {
        try {
            if (!institutionName || !email || !password || !credential) {
                setMensaje({ text: 'Todos los campos son obligatorios', color: 'red' });
                return;
            }
            const institutionData = {
                email: email,
                password: password,
                institutionalName: institutionName,
                credential: credential
            };
            await signUpInstitution(institutionData);
            setMensaje({ text: 'ModalRegistro exitoso', color: 'green' });
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMensaje({ text: 'Este correo electrónico ya está en uso', color: 'red' });
            } else {
                setMensaje({ text: 'Error de registro', color: 'red' });
            }

            console.error("Error de registro: ", error);
        }
    }

    return (
        <div>
            <div className="form-registro">
                <FloatingLabel controlId="floatingInput1" label="Nombre institucional" className="mb-3">
                    <Form.Control type="text" placeholder="Nombre" value={institutionName} onChange={(event) => setInstitutionName(event.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput2" label="Correo electrónico" className="mb-3">
                    <Form.Control type="email" placeholder="nombre@ejemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
                    <Form.Control type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput3" label="Credencial" className="mb-3">
                    <Form.Control type="text" placeholder="Credencial" value={credential} onChange={(event) => setCredential(event.target.value)} />
                </FloatingLabel>
            </div>
            <div>
                <Button variant="dark" onClick={enviarForm}>Registrarse</Button>
                <p style={{ marginTop: 10, color: mensaje.color }}>{mensaje.text}</p>
            </div>
        </div>
    );
}



