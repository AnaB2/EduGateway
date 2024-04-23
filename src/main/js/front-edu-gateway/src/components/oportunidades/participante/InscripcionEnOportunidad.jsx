import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../../services/auth";
import Button from "react-bootstrap/Button";
import {addOpportunity} from "../../../services/Api";

export function InscripcionEnOportunidad({actualizarOportunidades}){

    const [addSuccess, setAddSuccess] = useState(false); // true o false
    const [addError, setAddError] = useState(''); // indica error en caso de error


    // Controles del modal
    const[visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => {
        setVisible(false)
        setAddError('')
        setAddSuccess(false)
    }

    // Objeto navegación
    const navigate = useNavigate()

    // Controles de respuesta de form
    const [name, setName] = useState('');
    const [apellido, setApellido] = useState('');
    const [localidad, setLocalidad] = useState('')


    // Función que se ejecuta al presionar botón de envío, y que llama a función addOpportunity en Api.js
    async function enviarForm(){
        try{
            const opportunityData = {name:name, language:apellido, educationalLevel:educationalLevel, modality:modality, city:city, category:category, capacity:capacity}
            await addOpportunity(opportunityData)
            setAddSuccess(true)
            setAddError('')
            actualizarOportunidades()
        }catch (error){
            console.error("Error al inscribirse:", error)
            setAddSuccess(false)
            setAddError("Error al inscribirse.")
        }
    }

    return(
        <>
            <Button variant="dark" onClick={abrir}>Agregar oportunidad</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir oportunidad</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                        <FloatingLabel controlId="floatingName" label="Nombre" className="mb-3">
                            <Form.Control type="text" placeholder="Nombre de participante" onChange={(event)=>{setName(event.target.value)}}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingApellido" label="Apellido" className="mb-3">
                            <Form.Control type="text" placeholder="Apellido de participante" onChange={(event)=>{setApellido(event.target.value)}}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingEducationalLevel" label="Localidad" className="mb-3">
                            <Form.Control type="text" placeholder="Localidad de participante" onChange={(event)=>{setLocalidad(event.target.value)}}/>
                        </FloatingLabel>
                </Modal.Body>


                <Modal.Footer>
                    {addError!=='' && <p style={{ color: 'red', marginTop: 10 }}>{addError}</p>}
                    {addSuccess && <p style={{ marginTop: 10 }}>Inscripción con éxito.</p>}
                    <Button variant="success" onClick={enviarForm}>Confirmar</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}