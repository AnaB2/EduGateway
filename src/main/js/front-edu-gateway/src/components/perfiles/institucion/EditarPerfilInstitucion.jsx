import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { editInstitution } from "../../../services/Api";

export function EditarPerfilInstitucion({ actualizarInstitucion, datosAnteriores = {} }) {
    const [addSuccess, setAddSuccess] = useState(false);
    const [addError, setAddError] = useState('');
    const [visible, setVisible] = useState(false);

    const abrir = () => setVisible(true);
    const cerrar = () => {
        setVisible(false);
        setAddError('');
        setAddSuccess(false);
    };

    const [institutionalName, setInstitutionalName] = useState(datosAnteriores.institutionalName);
    const [password, setPassword] = useState(datosAnteriores.password);
    const [description, setDescription] = useState(datosAnteriores.description);

    async function enviarForm() {
        try {
            const institutionData = {
                institutionalName: institutionalName,
                password: password,
                description: description
            };
            console.log("Sending institution data: ", institutionData);
            await editInstitution(institutionData, datosAnteriores.email);
            setAddSuccess(true);
            setAddError('');
            actualizarInstitucion();
        } catch (error) {
            console.error("Error al editar perfil: ", error);
            setAddSuccess(false);
            setAddError("Error al editar perfil");
        }
    }

    return (
        <>
            <Button variant="dark" onClick={abrir}>Editar Perfil</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Perfil Institucional</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="form-perfil">
                        <FloatingLabel controlId="floatingInstitutionalName" label="Nombre Institucional" className="mb-3">
                            <Form.Control
                                value={institutionalName} // Valor actual del estado
                                type="text"
                                placeholder="Nombre Institucional"
                                onChange={(event) => setInstitutionalName(event.target.value)} // Sincronizar cambios con el estado
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Contraseña" className="mb-3">
                            <Form.Control
                                value={password} // La contraseña no se precarga por seguridad
                                type="password"
                                placeholder="Contraseña"
                                onChange={(event) => setPassword(event.target.value)} // Sincronizar cambios con el estado
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingDescription" label="Descripción" className="mb-3">
                            <Form.Control
                                value={description} // Valor actual del estado
                                as="textarea"
                                placeholder="Descripción"
                                onChange={(event) => setDescription(event.target.value)} // Sincronizar cambios con el estado
                            />
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
    );
}
