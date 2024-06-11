import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function VerHistorialInstitucion({ opportunities }) {
    const [visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => setVisible(false);

    return (
        <>
            <Button variant="dark" onClick={abrir}>Ver Historial</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Historial de Oportunidades</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="historial-oportunidades">
                        {opportunities.length > 0 ? (
                            <ul>
                                {opportunities.map((opportunity) => (
                                    <li key={opportunity.id}>
                                        <h3>{opportunity.name}</h3>
                                        <p>Categoría: {opportunity.category}</p>
                                        <p>Ciudad: {opportunity.city}</p>
                                        <p>Nivel Educativo: {opportunity.educationalLevel}</p>
                                        <p>Modalidad: {opportunity.modality}</p>
                                        <p>Idioma: {opportunity.language}</p>
                                        <p>Capacidad: {opportunity.capacity}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No se encontraron oportunidades.</p>
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
