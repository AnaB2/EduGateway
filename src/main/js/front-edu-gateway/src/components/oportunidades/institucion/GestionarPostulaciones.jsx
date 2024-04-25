import {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {getInscriptions} from "../../../services/Api";

export function GestionarPostulaciones({oportunidad}){
    const [participantes, setParticipantes] = useState([])
    const [pendientes, setPendientes] = useState([])
    const [aceptados, setAceptados] = useState([])
    const [rechazados, setRechazados] = useState([])
    const [cupos, setCupos] = useState(oportunidad.capacity)

    function disminuirCupos(){
        if (cupos<=0){throw Error("No hay mas cupos.")}
        setCupos(cupos-1)
    }

    // const participantes = []
    // función para mostrar participante según estado

    // Controles del modal
    const[visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => {setVisible(false)}

    // Objeto navegación
    const navigate = useNavigate()

    useEffect(() => {
        async function obtenerInscripciones() {
            try {
                const allInscriptions = await getInscriptions(); // todas las inscripciones asociadas al mail
                const inscriptionsForThisOpportunity = allInscriptions.filter(inscription => inscription.opportunityId === oportunidad.id);
                console.log(inscriptionsForThisOpportunity);
            } catch (error) {
                console.error("Error al obtener inscripciones:", error);
            }
        }
        obtenerInscripciones();
    }, []);


    return(
        <>
            <Button variant="dark" onClick={abrir}>Gestionar postulaciones</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Gestionar postulaciones</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Cupos disponibles: {cupos}</p>
                    <div>
                    </div>
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}