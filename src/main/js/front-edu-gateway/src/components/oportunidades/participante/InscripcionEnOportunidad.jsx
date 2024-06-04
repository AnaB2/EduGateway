import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { addInscription, getUserDetails } from "../../../services/Api"; // Assuming getUserDetails is an API call to fetch user details
import { getEmail } from "../../../services/storage";

export function InscripcionEnOportunidad({ actualizarOportunidades, oportunidadData }) {

    const [addSuccess, setAddSuccess] = useState(false); // true o false
    const [addError, setAddError] = useState(''); // indica error en caso de error

    // Controles del modal
    const [visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => {
        setVisible(false)
        setAddError('')
        setAddSuccess(false)
    }

    // Objeto navegación
    const navigate = useNavigate()

    // Controles de respuesta de form
    const [localidad, setLocalidad] = useState('');
    const [mensaje, setMensaje] = useState('');

    // User details
    const [userName, setUserName] = useState('');
    const [userLastName, setUserLastName] = useState('');

    // Fetch user details when modal opens
    useEffect(() => {
        if (visible) {
            (async () => {
                try {
                    const email = getEmail();
                    console.log("Fetching user details for email:", email); // Debugging line
                    const userDetails = await getUserDetails(email);
                    console.log("Fetched user details:", userDetails); // Debugging line
                    setUserName(userDetails.firstName);
                    setUserLastName(userDetails.lastName);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            })();
        }
    }, [visible]);

    // Función que se ejecuta al presionar botón de envío, y que llama a función addInscription en Api.js
    async function enviarForm() {
        try {
            const inscriptionData = { localidad: localidad, mensaje: mensaje, firstName: userName, lastName: userLastName }
            console.log("Sending inscription data:", inscriptionData); // Debugging line
            await addInscription(getEmail(), oportunidadData.id, inscriptionData)
            setAddSuccess(true)
            setAddError('')
            actualizarOportunidades()
        } catch (error) {
            console.error("Error al inscribirse:", error)
            setAddSuccess(false)
            setAddError("Error al inscribirse.")
        }
    }

    return (
        <>
            <Button variant="dark" onClick={abrir}>Inscribirme</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Inscribirme en {oportunidadData.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <FloatingLabel controlId="floatingLocalidad" label="Localidad" className="mb-3">
                        <Form.Control type="text" placeholder="Localidad de participante" value={localidad} onChange={(event) => { setLocalidad(event.target.value) }} />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingMensaje" label="Mensaje" className="mb-3">
                        <Form.Control as="textarea" placeholder="Mensaje" value={mensaje} onChange={(event) => { setMensaje(event.target.value) }} />
                    </FloatingLabel>
                </Modal.Body>

                <Modal.Footer>
                    {addError !== '' && <p style={{ color: 'red', marginTop: 10 }}>{addError}</p>}
                    {addSuccess && <p style={{ marginTop: 10 }}>Inscripción con éxito.</p>}
                    <Button variant="success" onClick={enviarForm}>Confirmar</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
