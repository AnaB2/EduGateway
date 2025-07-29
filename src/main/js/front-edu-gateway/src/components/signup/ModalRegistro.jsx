import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {FormularioRegistroParticipante} from "./FormularioRegistroParticipante";
import {FormularioRegistroInstitucion} from "./FormularioRegistroInstitucion";
import Button from "react-bootstrap/Button";

export function ModalRegistro(){

    const[visible, setVisible] = useState(false)
    const[formVisible, setFormVisible] = useState(<></>)
    const[botonActivo, setBotonActivo] = useState('')

    const cerrar = () => {
        setVisible(false)
        setFormVisible(<></>)
        setBotonActivo('')
    }
    const abrir = () => setVisible(true)

    const verFormDeUsuario = (form, usuario) => {
        setFormVisible(form)
        setBotonActivo(usuario)
    }

    return(
        <>
            <Button variant="dark" onClick={abrir}>Registrarse</Button>

            <Modal 
                show={visible} 
                onHide={cerrar} 
                backdrop="static" 
                keyboard={false}
                className="modern-modal"
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>🌟 Únete a EduGateway</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="text-center mb-4">
                        <p style={{ 
                            color: '#667eea', 
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            marginBottom: '0.5rem'
                        }}>
                            Comienza tu experiencia educativa
                        </p>
                        <p style={{ 
                            color: '#6b7280', 
                            fontSize: '0.95rem',
                            margin: 0
                        }}>
                            Selecciona tu tipo de cuenta para empezar
                        </p>
                    </div>

                    <div className="modern-registration-options">
                        <Button 
                            className={`modern-btn ${botonActivo === 'participante' ? 'modern-btn-primary' : 'modern-btn-secondary'}`}
                            onClick={() => verFormDeUsuario(<FormularioRegistroParticipante/>, 'participante')}
                        >
                            🎓 Participante
                            <small className="d-block mt-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                Estudiante o profesional
                            </small>
                        </Button>
                        <Button 
                            className={`modern-btn ${botonActivo === 'institucion' ? 'modern-btn-primary' : 'modern-btn-secondary'}`}
                            onClick={() => verFormDeUsuario(<FormularioRegistroInstitucion/>, 'institucion')}
                        >
                            🏫 Institución
                            <small className="d-block mt-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                Centro educativo u organización
                            </small>
                        </Button>
                    </div>

                    <div className="modern-registration-form">
                        {formVisible}
                    </div>

                    {!botonActivo && (
                        <div className="text-center" style={{ 
                            padding: '2rem',
                            color: '#9ca3af',
                            fontStyle: 'italic'
                        }}>
                            👆 Selecciona tu tipo de cuenta para continuar
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        className="modern-btn modern-btn-secondary" 
                        onClick={cerrar}
                    >
                        Cancelar
                    </Button>
                    {botonActivo && (
                        <div style={{ 
                            fontSize: '0.9rem', 
                            color: '#667eea',
                            fontWeight: '500'
                        }}>
                            ✨ Completa el formulario para crear tu cuenta
                        </div>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}