import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../services/auth";
import Button from "react-bootstrap/Button";

export function LoginModal(){

    // Controles del modal
    const[visible, setVisible] = useState(false);
    const cerrar = () => {
        setVisible(false)
        setLoginError('')
        setEmail('')
        setPassword('')
    };
    const abrir = () => setVisible(true);

    // Objeto navegación
    const navigate = useNavigate()

    // Controles de respuesta de form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);

    // Función que se ejecuta al presionar boton de envío
    async function enviarForm(){
        if (!email || !password) {
            setLoginError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        setLoginError('');
        
        try{
            const userData = {email: email, password: password}
            await loginUser(userData, navigate)
            setLoginSuccess(true)
            setLoginError('')
            
            // Cerrar modal después de login exitoso
            setTimeout(() => {
                cerrar();
                setLoginSuccess(false);
            }, 1500);
            
        }catch (error){
            console.error("Error en login: ", error)
            setLoginSuccess(false)
            setLoginError("Correo electrónico o contraseña incorrectos")
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            enviarForm();
        }
    };

    return(
        <>
            <Button variant="dark" onClick={abrir}>Iniciar sesión</Button>

            <Modal 
                show={visible} 
                onHide={cerrar} 
                backdrop="static" 
                keyboard={false}
                className="modern-modal"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Bienvenido de vuelta</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="modern-form">
                        <p className="text-center mb-4" style={{ 
                            color: '#667eea', 
                            fontSize: '1.1rem',
                            fontWeight: '500' 
                        }}>
                            Ingresa a tu cuenta para continuar tu experiencia educativa
                        </p>
                        
                        <FloatingLabel 
                            controlId="loginEmail" 
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
                            controlId="loginPassword" 
                            label="Contraseña"
                        >
                            <Form.Control 
                                type="password" 
                                placeholder="Contraseña" 
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                        </FloatingLabel>

                        {loginError && (
                            <div className="modern-alert modern-alert-error">
                                ❌ {loginError}
                            </div>
                        )}
                        
                        {loginSuccess && (
                            <div className="modern-alert modern-alert-success">
                                ✅ ¡Inicio de sesión exitoso! Redirigiendo...
                            </div>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        className="modern-btn modern-btn-success" 
                        onClick={enviarForm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Iniciando...
                            </>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </Button>
                    <Button 
                        className="modern-btn modern-btn-secondary" 
                        onClick={cerrar}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}