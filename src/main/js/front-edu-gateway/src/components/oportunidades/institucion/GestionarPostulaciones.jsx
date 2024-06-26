import {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom";
import {approveInscription, getInscriptions, rejectInscription} from "../../../services/Api";

export function GestionarPostulaciones({oportunidad}){
    const [inscripciones, setInscripciones] = useState([]);
    const [pendientes, setPendientes] = useState([])
    const [aceptados, setAceptados] = useState([])
    const [rechazados, setRechazados] = useState([])
    const [cupos, setCupos] = useState(oportunidad.capacity)

    function disminuirCupos(){
        // HAY QUE HACER QUE PIDA LOS CUPOS AL BACK ACTUALIZADOS
        // LOS CUPOS TIENEN QUE ACTUALIZARSE DESDE EL BACK CUANDO SE ACEPTA O RECHAZA POSTULACION
    }

    // Controles del modal
    const[visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => {setVisible(false)}

    // Objeto navegación
    const navigate = useNavigate()

    useEffect(() => {
        setCupos(oportunidad.capacity)
    }, [oportunidad.capacity]);

    async function obtenerInscripciones() {
        try {
            const allInscriptions = await getInscriptions();
            // console.log(allInscriptions)
            const inscripcionesOpportunity = allInscriptions.filter(inscripcion => inscripcion.opportunityName == oportunidad.name);
            console.log(inscripcionesOpportunity)
            setInscripciones(inscripcionesOpportunity[0].inscriptions);
        } catch (error) {
            console.error("Error al obtener inscripciones:", error);
        }
    }

    useEffect( () => {
        if (visible) {
            obtenerInscripciones();
        }
    }, [visible]);

    useEffect(() => {
        // Organizar las inscripciones según su estado
        const pendientes = inscripciones.filter(inscripcion => inscripcion.estado === 'PENDING');
        const aceptados = inscripciones.filter(inscripcion => inscripcion.estado === 'ACCEPTED');
        const rechazados = inscripciones.filter(inscripcion => inscripcion.estado === 'REJECTED');
        setPendientes(pendientes);
        setAceptados(aceptados);
        setRechazados(rechazados);
    }, [inscripciones]);

    function aceptarPostulacion(inscriptionId) {
        console.log(inscriptionId)
        approveInscription(inscriptionId)
            .then(() =>  {
                obtenerInscripciones();
            })
    }

    function rechazarPostulacion(inscriptionId){
        rejectInscription(inscriptionId)


            .then(() =>  {
                obtenerInscripciones();
            })

    }

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
                        <div className="pendientes">
                            {pendientes.map(inscripcion =>(<div style={{backgroundColor:'yellow', display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:'center', padding:'10px'}}>
                                {inscripcion.inscriptionName + " ID " + inscripcion.inscriptionId}
                                <div  key={inscripcion.id} style={{display:"flex", flexDirection:"row", gap:'5px'}}>
                                    <Button onClick={()=>aceptarPostulacion(inscripcion.inscriptionId)} className="btn-dark">SI</Button>
                                    <Button onClick={()=>rechazarPostulacion(inscripcion.inscriptionId)} className="btn-dark">NO</Button>
                                </div>
                            </div>))}
                        </div>
                        <div className="aceptados">
                            {aceptados.map(inscripcion =>(<div style={{backgroundColor:'green', display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:'center', padding:'10px'}} key={inscripcion.id}>{inscripcion.inscriptionName}</div>))}
                        </div>
                        <div className="rechazados">
                            {rechazados.map(inscripcion=>(<div style={{backgroundColor:'red', display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:'center', padding:'10px'}} key={inscripcion.id}>{inscripcion.inscriptionName}</div>))}
                        </div>
                    </div>
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}