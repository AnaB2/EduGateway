import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../../../services/auth";
import Button from "react-bootstrap/Button";
import {addOpportunity, modifyOpportunity} from "../../../services/Api";

export function EditarOportunidad({actualizarOportunidades, datosAnteriores}){

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
    const [name, setName] = useState(datosAnteriores.name);
    const [language, setLanguage] = useState(datosAnteriores.language);
    const [educationalLevel, setEducationalLevel] = useState(datosAnteriores.educationalLevel)
    const [modality, setModality] = useState(datosAnteriores.modality)
    const [city, setCity] = useState(datosAnteriores.city)
    const [category, setCategory] = useState(datosAnteriores.category)
    const [capacity, setCapacity] = useState(datosAnteriores.capacity)


    // Función que se ejecuta al presionar botón de envío, y que llama a función addOpportunity en Api.js
    async function enviarForm(){
        try{
            const opportunityData = {name:name, language:language, educationalLevel:educationalLevel, modality:modality, city:city, category:category, capacity:capacity}
            await modifyOpportunity(opportunityData, datosAnteriores.name)
            setAddSuccess(true)
            setAddError('')
            actualizarOportunidades()
        }catch (error){
            console.error("Error al editar oportunidad: ", error)
            setAddSuccess(false)
            setAddError("Error al editar oportunidad")
        }
    }

    return(
        <>
            <Button variant="dark" onClick={abrir}>Editar</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar {datosAnteriores.category} {datosAnteriores.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="form-oportunidad">
                        <FloatingLabel controlId="floatingLanguage" label="Idioma" className="mb-3">
                            <Form.Control defaultValue={datosAnteriores.language} type="text" placeholder="Idioma de la oportunidad" onChange={(event)=>{setLanguage(event.target.value)}}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingEducationalLevel" label="Nivel educativo" className="mb-3">
                            <Form.Control defaultValue={datosAnteriores.educationalLevel} type="text" placeholder="Nivel educativo requerido" onChange={(event)=>{setEducationalLevel(event.target.value)}}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingModality" label="Modalidad" className="mb-3">
                            <Form.Control defaultValue={datosAnteriores.modality} type="text" placeholder="Modalidad" onChange={(event)=>{setModality(event.target.value)}}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingCity" label="Ciudad" className="mb-3">
                            <Form.Control defaultValue={datosAnteriores.city} type="text" placeholder="Ciudad" onChange={(event)=>{setCity(event.target.value)}}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingCapacity" label="Capacidad" className="mb-3">
                            <Form.Control defaultValue={datosAnteriores.capacity} type="number" placeholder="Capacidad" onChange={(event)=>{setCapacity(event.target.value)}}/>
                        </FloatingLabel>
                    </div>
                </Modal.Body>


                <Modal.Footer>
                    {addError!=='' && <p style={{ color: 'red', marginTop: 10 }}>{addError}</p>}
                    {addSuccess && <p style={{ marginTop: 10 }}>Oportunidad editada con éxito.</p>}
                    <Button variant="success" onClick={enviarForm}>Confirmar</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}