import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { deleteInstitution } from "../../../services/Api";

export function EliminarPerfilInstitucion({ actualizarInstitucion, email }) {
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [visible, setVisible] = useState(false);

    const abrir = () => setVisible(true);
    const cerrar = () => {
        setVisible(false);
        setDeleteError('');
        setDeleteSuccess(false);
    }

    async function eliminarInstitucion() {
        try {
            await deleteInstitution(email);
            setDeleteSuccess(true);
            setDeleteError('');
            actualizarInstitucion();
            cerrar(); // Cerrar el modal después de eliminar la institución
        } catch (error) {
            console.error("Error al eliminar institución: ", error);
            setDeleteSuccess(false);
            setDeleteError("Error al eliminar institución");
        }
    }

    return (
        <>
            <Button variant="danger" onClick={abrir}>Eliminar Institución</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Perfil</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {deleteError !== '' && <p style={{ color: 'red', marginTop: 10 }}>{deleteError}</p>}
                    {deleteSuccess && <p style={{ marginTop: 10 }}>Institución eliminada con éxito.</p>}
                    <p>¿Estás seguro de que deseas eliminar este perfil?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={eliminarInstitucion}>Confirmar</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}