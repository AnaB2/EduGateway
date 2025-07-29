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
            console.log("Todas las inscripciones recibidas:", allInscriptions);
            const inscripcionesOpportunity = allInscriptions.filter(inscripcion => inscripcion.opportunityName == oportunidad.name);
            console.log("Inscripciones filtradas para esta oportunidad:", inscripcionesOpportunity);
            if (inscripcionesOpportunity.length > 0) {
                console.log("Inscripciones individuales:", inscripcionesOpportunity[0].inscriptions);
            setInscripciones(inscripcionesOpportunity[0].inscriptions);
            }
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

    async function aceptarPostulacion(inscriptionId) {
        try {
            const response = await approveInscription(inscriptionId);
            
            // Actualizar cupos si la respuesta incluye información actualizada
            if (response.currentCapacity !== undefined) {
                setCupos(response.currentCapacity);
                console.log("Cupos actualizados a:", response.currentCapacity);
            }
            
            // Actualizar la lista de inscripciones
            await obtenerInscripciones();
        } catch (error) {
            console.error("Error al aceptar postulación:", error);
        }
    }

    async function rechazarPostulacion(inscriptionId) {
        try {
            const response = await rejectInscription(inscriptionId);
            
            // Actualizar cupos si la respuesta incluye información actualizada
            if (response.currentCapacity !== undefined) {
                setCupos(response.currentCapacity);
                console.log("Cupos actualizados a:", response.currentCapacity);
            }
            
            // Actualizar la lista de inscripciones
            await obtenerInscripciones();
        } catch (error) {
            console.error("Error al rechazar postulación:", error);
        }
    }

    return(
        <>
            <Button variant="dark" onClick={abrir}>Ver postulaciones</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Ver postulaciones</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ color: '#333', fontWeight: 'bold' }}>Cupos disponibles: {cupos}</h5>
                    </div>
                    
                    {/* Postulaciones Pendientes */}
                    {pendientes.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <h6 style={{ 
                                color: '#f39c12', 
                                fontWeight: 'bold', 
                                borderBottom: '2px solid #f39c12', 
                                paddingBottom: '5px',
                                marginBottom: '15px'
                            }}>
                                Postulaciones Pendientes ({pendientes.length})
                            </h6>
                            {pendientes.map(inscripcion => {
                                console.log("Datos de inscripción pendiente:", inscripcion);
                                return (
                                <div key={inscripcion.inscriptionId} style={{
                                    backgroundColor: '#fff8dc',
                                    border: '1px solid #f39c12',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '15px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <h6 style={{ color: '#333', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                                            {inscripcion.nombre || 'N/A'} {inscripcion.apellido || ''}
                                        </h6>
                                        <p style={{ margin: '3px 0', color: '#666', fontSize: '0.9em' }}>
                                            <strong>Localidad:</strong> {inscripcion.localidad || 'No especificada'}
                                        </p>
                                        {inscripcion.mensaje && inscripcion.mensaje.trim() !== '' && (
                                            <div style={{ marginTop: '8px' }}>
                                                <strong style={{ color: '#333', fontSize: '0.9em' }}>Mensaje:</strong>
                                                <div style={{
                                                    backgroundColor: '#f8f9fa',
                                                    border: '1px solid #e9ecef',
                                                    borderRadius: '4px',
                                                    padding: '8px',
                                                    marginTop: '5px',
                                                    fontSize: '0.9em',
                                                    maxHeight: '80px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {inscripcion.mensaje}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <Button 
                                            onClick={() => aceptarPostulacion(inscripcion.inscriptionId)} 
                                            style={{
                                                backgroundColor: '#28a745',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '6px 12px',
                                                fontSize: '0.9em'
                                            }}
                                        >
                                            Aceptar
                                        </Button>
                                        <Button 
                                            onClick={() => rechazarPostulacion(inscripcion.inscriptionId)} 
                                            style={{
                                                backgroundColor: '#dc3545',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '6px 12px',
                                                fontSize: '0.9em'
                                            }}
                                        >
                                            Rechazar
                                        </Button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Postulaciones Aceptadas */}
                    {aceptados.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <h6 style={{ 
                                color: '#28a745', 
                                fontWeight: 'bold', 
                                borderBottom: '2px solid #28a745', 
                                paddingBottom: '5px',
                                marginBottom: '15px'
                            }}>
                                Postulaciones Aceptadas ({aceptados.length})
                            </h6>
                            {aceptados.map(inscripcion => {
                                console.log("Datos de inscripción aceptada:", inscripcion);
                                return (
                                <div key={inscripcion.inscriptionId} style={{
                                    backgroundColor: '#d4edda',
                                    border: '1px solid #28a745',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <h6 style={{ color: '#155724', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                                        {inscripcion.nombre || 'N/A'} {inscripcion.apellido || ''}
                                    </h6>
                                    <p style={{ margin: '3px 0', color: '#155724', fontSize: '0.9em' }}>
                                        <strong>Localidad:</strong> {inscripcion.localidad || 'No especificada'}
                                    </p>
                                    {inscripcion.mensaje && inscripcion.mensaje.trim() !== '' && (
                                        <div style={{ marginTop: '8px' }}>
                                            <strong style={{ color: '#155724', fontSize: '0.9em' }}>Mensaje:</strong>
                                            <div style={{
                                                backgroundColor: '#c3e6cb',
                                                border: '1px solid #b6d4b6',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                marginTop: '5px',
                                                fontSize: '0.9em',
                                                maxHeight: '80px',
                                                overflowY: 'auto'
                                            }}>
                                                {inscripcion.mensaje}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Postulaciones Rechazadas */}
                    {rechazados.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h6 style={{ 
                                color: '#dc3545', 
                                fontWeight: 'bold', 
                                borderBottom: '2px solid #dc3545', 
                                paddingBottom: '5px',
                                marginBottom: '15px'
                            }}>
                                Postulaciones Rechazadas ({rechazados.length})
                            </h6>
                            {rechazados.map(inscripcion => (
                                <div key={inscripcion.inscriptionId} style={{
                                    backgroundColor: '#f8d7da',
                                    border: '1px solid #dc3545',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <h6 style={{ color: '#721c24', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                                        {inscripcion.nombre || 'N/A'} {inscripcion.apellido || ''}
                                    </h6>
                                    <p style={{ margin: '3px 0', color: '#721c24', fontSize: '0.9em' }}>
                                        <strong>Localidad:</strong> {inscripcion.localidad || 'No especificada'}
                                    </p>
                                    {inscripcion.mensaje && inscripcion.mensaje.trim() !== '' && (
                                        <div style={{ marginTop: '8px' }}>
                                            <strong style={{ color: '#721c24', fontSize: '0.9em' }}>Mensaje:</strong>
                                            <div style={{
                                                backgroundColor: '#f1b2b5',
                                                border: '1px solid #e85e6b',
                                                borderRadius: '4px',
                                                padding: '8px',
                                                marginTop: '5px',
                                                fontSize: '0.9em',
                                                maxHeight: '80px',
                                                overflowY: 'auto'
                                            }}>
                                                {inscripcion.mensaje}
                        </div>
                    </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Estado vacío */}
                    {pendientes.length === 0 && aceptados.length === 0 && rechazados.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            color: '#6c757d',
                            padding: '40px 20px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <h5>No hay postulaciones aún</h5>
                            <p>Cuando los participantes se postulen a esta oportunidad, aparecerán aquí.</p>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}