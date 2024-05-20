import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {editInstitution} from "../../../services/Api";
//import { useNavigate } from "react-router-dom";

export function EditarPerfilInstitucion({ actualizarParticipante, datosAnteriores = {} }) {
    const [addSuccess, setAddSuccess] = useState(false);
    const [addError, setAddError] = useState('');
    const[visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => {
        setVisible(false)
        setAddError('')
        setAddSuccess(false)
    }

    const [institutionalName, setInstitutionalName] = useState(datosAnteriores.institutionalName);
    const [password, setPassword] = useState(datosAnteriores.password);
    const [description, setDescription] = useState(datosAnteriores.description);

    async function enviarForm() {
        try {
            const institutionData = { institutionalName: institutionalName, password: password, description: description };
            await editInstitution(institutionData, datosAnteriores.email);
            setAddSuccess(true);
            setAddError('');
            actualizarParticipante();
        } catch (error) {
            console.error("Error al editar perfil: ", error);
            setAddSuccess(false);
            setAddError("Error al editar perfil");
        }
    }

    return (
        <>
            <Button variant="dark" onClick={abrir}>Editar</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Perfil</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="form-perfil">
                        <FloatingLabel controlId="floatingFirstName" label="Nombre Institucional" className="mb-3">
                            <Form.Control defaultValue={datosAnteriores.institutionalName} type="text" placeholder="Nombre Intitucional" onChange={(event) => setInstitutionalName(event.target.value)} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
                            <Form.Control type="password" placeholder="Contraseña" onChange={(event) => setPassword(event.target.value)} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingDescription" label="Descripción" className="mb-3">
                            <Form.Control defaultValue={datosAnteriores.description} as="textarea" placeholder="Descripción" onChange={(event) => setDescription(event.target.value)} />
                        </FloatingLabel>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    {addError !== '' && <p style={{ color: 'red', marginTop: 10 }}>{addError}</p>}
                    {addSuccess && <p style={{ marginTop: 10 }}>Perfil editado con éxito.</p>}
                    <Button variant="success" onClick={enviarForm}>Confirmar</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}