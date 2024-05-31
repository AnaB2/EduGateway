import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { deleteUser } from "../../../services/Api";

export function EliminarPerfilParticipante({ actualizarParticipante, email }) {
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [visible, setVisible] = useState(false);

    const abrir = () => setVisible(true);
    const cerrar = () => {
        setVisible(false);
        setDeleteError('');
        setDeleteSuccess(false);
    }

    async function eliminarUsuario() {
        try {
            await deleteUser(email);
            setDeleteSuccess(true);
            setDeleteError('');
            actualizarParticipante();
            cerrar(); // Cerrar el modal después de eliminar el usuario
        } catch (error) {
            console.error("Error al eliminar usuario: ", error);
            setDeleteSuccess(false);
            setDeleteError("Error al eliminar usuario");
        }
    }

    return (
        <>
            <Button variant="danger" onClick={abrir}>Eliminar Usuario</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Perfil</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {deleteError !== '' && <p style={{ color: 'red', marginTop: 10 }}>{deleteError}</p>}
                    {deleteSuccess && <p style={{ marginTop: 10 }}>Usuario eliminado con éxito.</p>}
                    <p>¿Estás seguro de que deseas eliminar este perfil?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={eliminarUsuario}>Confirmar</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
