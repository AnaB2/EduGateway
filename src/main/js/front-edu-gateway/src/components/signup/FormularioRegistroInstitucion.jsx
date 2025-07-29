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

            const institutionData = {
                email: email,
                password: password,
                institutionalName: institutionName,
                credential: credential
            };

            await signUpInstitution(institutionData);
            setMensaje({ text: '¡Registro exitoso!', type: 'success' });
            
            setTimeout(() => {
                navigate('/');
            }, 1500);
            
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMensaje({ text: 'Este correo electrónico ya está en uso', type: 'error' });
            } else {
                setMensaje({ text: 'Error de registro. Intenta nuevamente.', type: 'error' });
            }
            console.error("Error de registro: ", error);
        } finally {
            setLoading(false);
        }
    }

    function validateForm() {
        if (!institutionName || !email || !password || !credential) {
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
                Registro de Institución
            </div>

            <FloatingLabel 
                controlId="institucionName" 
                label="Nombre institucional" 
                className="mb-3"
            >
                <Form.Control 
                    type="text" 
                    placeholder="Nombre de tu institución" 
                    value={institutionName} 
                    onChange={(event) => setInstitutionName(event.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
            </FloatingLabel>

            <FloatingLabel 
                controlId="institucionEmail" 
                label="Correo electrónico institucional" 
                className="mb-3"
            >
                <Form.Control 
                    type="email" 
                    placeholder="institucion@ejemplo.com" 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
            </FloatingLabel>

            <FloatingLabel 
                controlId="institucionPassword" 
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

            <FloatingLabel 
                controlId="institucionCredential" 
                label="Credencial institucional" 
                className="mb-3"
            >
                <Form.Control 
                    type="text" 
                    placeholder="Número de registro o credencial" 
                    value={credential} 
                    onChange={(event) => setCredential(event.target.value)}
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
                        'Crear cuenta institucional'
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



