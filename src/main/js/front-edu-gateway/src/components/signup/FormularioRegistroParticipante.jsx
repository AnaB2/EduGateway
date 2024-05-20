import React, { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signUpUser } from "../../services/register.js";
import { useNavigate } from "react-router";

export function FormularioRegistroParticipante() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const navigate = useNavigate();

    async function enviarForm() {
        try {
            if (!validateForm()) return;

            const userData = {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            };

            await signUpUser(userData);
            setMensaje({ text: 'ModalRegistro exitoso', color: 'green' });
            navigate('/');
        } catch (error) {
            setMensaje({ text: 'Error de registro', color: 'red' });
            console.error("Error de registro: ", error);
        }
    }

    function validateForm() {
        if (!firstname || !lastname || !email || !password) {
            setMensaje({ text: 'Todos los campos son obligatorios', color: 'red' });
            return false;
        }

        if (!isValidEmail(email)) {
            setMensaje({ text: 'Formato de correo electrónico inválido', color: 'red' });
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        // Implement email validation logic here
        // For example, you can use regular expressions or a library like validator.js
        // Here's a basic example:
        return email.match(/^[\w-]+(\.[\w-]+)*@([a-z0-9-]+\.)+[a-z]{2,}$/i);
    }

    return (
        <div>
            <div className="form-registro">
                <FloatingLabel controlId="floatingInput1" label="Nombre" className="mb-3">
                    <Form.Control type="text" placeholder="Nombre" onChange={(event) => { setFirstName(event.target.value) }} />
                </FloatingLabel>

                <FloatingLabel controlId="floatingInput2" label="Apellido" className="mb-3">
                    <Form.Control type="text" placeholder="Apellido" onChange={(event) => { setLastName(event.target.value) }} />
                </FloatingLabel>

                <FloatingLabel controlId="floatingInput3" label="Correo electrónico" className="mb-3">
                    <Form.Control type="email" placeholder="nombre@ejemplo.com" onChange={(event) => { setEmail(event.target.value) }} />
                </FloatingLabel>

                <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
                    <Form.Control type="password" placeholder="Contraseña" onChange={(event) => { setPassword(event.target.value) }} />
                </FloatingLabel>
            </div>
            <div>
                <Button variant="dark" onClick={enviarForm}>Registrarse</Button>
                <p style={{ marginTop: 10, color: mensaje.color }}>{mensaje.text}</p>
            </div>
        </div>
    );
}

