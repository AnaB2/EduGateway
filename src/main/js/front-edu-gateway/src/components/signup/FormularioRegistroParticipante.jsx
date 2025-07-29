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
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function enviarForm() {
        setLoading(true);
        setMensaje('');

        try {
            if (!validateForm()) {
                setLoading(false);
                return;
            }

            const userData = {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname
            };

            await signUpUser(userData);
            setMensaje({ text: '¡Registro exitoso!', type: 'success' });
            
            setTimeout(() => {
                navigate('/');
            }, 1500);
            
        } catch (error) {
            setMensaje({ text: 'Error de registro. Intenta nuevamente.', type: 'error' });
            console.error("Error de registro: ", error);
        } finally {
            setLoading(false);
        }
    }

    function validateForm() {
        if (!firstname || !lastname || !email || !password) {
            setMensaje({ text: 'Todos los campos son obligatorios', type: 'error' });
            return false;
        }

        if (password.length < 6) {
            setMensaje({ text: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
            return false;
        }

        if (!isValidEmail(email)) {
            setMensaje({ text: 'Formato de correo electrónico inválido', type: 'error' });
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        return email.match(/^[\w-]+(\.[\w-]+)*@([a-z0-9-]+\.)+[a-z]{2,}$/i);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            enviarForm();
        }
    };

    return (
        <div className="modern-form">
            <div className="text-center mb-4" style={{ 
                color: '#667eea', 
                fontSize: '1rem',
                fontWeight: '500' 
            }}>
                Registro de Participante
            </div>

            <div className="row">
                <div className="col-md-6">
                    <FloatingLabel 
                        controlId="participanteFirstname" 
                        label="Nombre" 
                        className="mb-3"
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="Tu nombre" 
                            value={firstname} 
                            onChange={(event) => setFirstName(event.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                    </FloatingLabel>
                </div>
                <div className="col-md-6">
                    <FloatingLabel 
                        controlId="participanteLastname" 
                        label="Apellido" 
                        className="mb-3"
                    >
                        <Form.Control 
                            type="text" 
                            placeholder=" " 
                            value={lastname} 
                            onChange={(event) => setLastName(event.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                    </FloatingLabel>
                </div>
            </div>

            <FloatingLabel 
                controlId="participanteEmail" 
                label="Correo electrónico" 
                className="mb-3"
            >
                <Form.Control 
                    type="email" 
                    placeholder="nombre@ejemplo.com" 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
            </FloatingLabel>

            <FloatingLabel 
                controlId="participantePassword" 
                label="Contraseña" 
                className="mb-3"
            >
                <Form.Control 
                    type="password" 
                    placeholder="Mínimo 6 caracteres" 
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
            </FloatingLabel>

            <div className="text-center">
                <Button 
                    className="modern-btn modern-btn-primary"
                    onClick={enviarForm}
                    disabled={loading}
                    style={{ minWidth: '200px' }}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Registrando...
                        </>
                    ) : (
                        'Crear cuenta'
                    )}
                </Button>
            </div>

            {mensaje && (
                <div className={`modern-alert ${mensaje.type === 'success' ? 'modern-alert-success' : 'modern-alert-error'}`}>
                    {mensaje.text}
                </div>
            )}
        </div>
    );
}

