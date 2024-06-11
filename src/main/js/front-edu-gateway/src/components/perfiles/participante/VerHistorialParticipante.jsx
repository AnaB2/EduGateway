import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function VerHistorialParticipante({ inscriptions }) {
    const [visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => setVisible(false);

    return (
        <>
            <Button variant="dark" onClick={abrir}>Ver Historial de Inscripciones</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Historial de Inscripciones</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="historial-inscripciones">
                        {inscriptions.length > 0 ? (
                            <ul>
                                {inscriptions.map((inscription) => (
                                    <li key={inscription.id}>
                                        <h3>ID de Oportunidad: {inscription.opportunity}</h3>
                                        <p>Oportunidad: {inscription.opportunity}</p>
                                        <p>Localidad: {inscription.localidad}</p>
                                        <p>Mensaje: {inscription.mensaje}</p>
                                        <p>Estado: {inscription.estado}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No se encontraron inscripciones.</p>
                        )}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
