import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { approveInscription, getInscriptions, rejectInscription, getOpportunityById } from "../../../services/Api";

export function GestionarPostulaciones({ oportunidad }) {
    const [inscripciones, setInscripciones] = useState([]);
    const [pendientes, setPendientes] = useState([]);
    const [aceptados, setAceptados] = useState([]);
    const [rechazados, setRechazados] = useState([]);
    const [cupos, setCupos] = useState(oportunidad.capacity);

    // Controles del modal
    const [visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => setVisible(false);

    // Objeto navegación
    const navigate = useNavigate();

    // Función para traer la capacidad/cupos actualizada del backend
    async function fetchCuposActualizados() {
        try {
            const updatedOpportunity = await getOpportunityById(oportunidad.id); // o el campo real de id
            setCupos(updatedOpportunity.capacity);
        } catch (error) {
            console.error("Error trayendo cupos actualizados:", error);
        }
    }

    useEffect(() => {
        setCupos(oportunidad.capacity)
    }, [oportunidad.capacity]);

    async function obtenerInscripciones() {
        try {
            const allInscriptions = await getInscriptions();
            const inscripcionesOpportunity = allInscriptions.filter(
                inscripcion => inscripcion.opportunityName === oportunidad.name
            );
            if (inscripcionesOpportunity.length > 0) {
                setInscripciones(inscripcionesOpportunity[0].inscriptions);
            } else {
                setInscripciones([]);
            }

            // Traer el cupo actualizado después de cargar inscripciones
            fetchCuposActualizados();

        } catch (error) {
            console.error("Error al obtener inscripciones:", error);
        }
    }

    useEffect(() => {
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
        approveInscription(inscriptionId)
            .then(() => {
                obtenerInscripciones(); // Actualiza inscripciones y cupos
            })
    }

    function rechazarPostulacion(inscriptionId) {
        rejectInscription(inscriptionId)
            .then(() => {
                obtenerInscripciones(); // Actualiza inscripciones y cupos
            })
    }

    // Función para mostrar el nombre más completo posible
    function mostrarNombre(inscripcion) {
        // Si existe un nombre combinado
        if (inscripcion.inscriptionName) return inscripcion.inscriptionName;
        // Si tiene nombre y apellido por separado
        if (inscripcion.firstName || inscripcion.lastName)
            return `${inscripcion.firstName || ""} ${inscripcion.lastName || ""}`.trim();
        return "-";
    }

    // Función robusta para mostrar el mensaje cualquiera sea el campo
    function mostrarMensaje(inscripcion) {
        if (inscripcion.mensaje) return inscripcion.mensaje;
        if (inscripcion.message) return inscripcion.message;
        if (inscripcion.userMessage) return inscripcion.userMessage;
        if (inscripcion.comment) return inscripcion.comment;
        if (inscripcion.msg) return inscripcion.msg;
        return "Sin mensaje";
    }

    return (
        <>
            <Button variant="dark" onClick={abrir}>Gestionar postulaciones</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Gestionar postulaciones</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Cupos disponibles: {cupos}</p>
                    <div>
                        {/* Pendientes */}
                        <div className="pendientes">
                            {pendientes.map(inscripcion => (
                                <div
                                    key={inscripcion.inscriptionId}
                                    style={{
                                        backgroundColor: 'yellow',
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: '6px',
                                        padding: '10px',
                                        marginBottom: '8px',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <div><b>Nombre:</b> {mostrarNombre(inscripcion)}</div>
                                    <div><b>ID:</b> {inscripcion.inscriptionId}</div>
                                    <div><b>Localidad:</b> {inscripcion.localidad || "Sin info"}</div>
                                    <div><b>Mensaje:</b> <i>{mostrarMensaje(inscripcion)}</i></div>
                                    <div style={{ display: "flex", flexDirection: "row", gap: '7px', marginTop: 4 }}>
                                        <Button onClick={() => aceptarPostulacion(inscripcion.inscriptionId)} className="btn-dark">Aceptar</Button>
                                        <Button onClick={() => rechazarPostulacion(inscripcion.inscriptionId)} className="btn-dark">Rechazar</Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Aceptados */}
                        <div className="aceptados">
                            {aceptados.map(inscripcion => (
                                <div
                                    key={inscripcion.inscriptionId}
                                    style={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: '5px',
                                        padding: '10px',
                                        marginBottom: '8px',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <div><b>Nombre:</b> {mostrarNombre(inscripcion)}</div>
                                    <div><b>ID:</b> {inscripcion.inscriptionId}</div>
                                    <div><b>Localidad:</b> {inscripcion.localidad || "Sin info"}</div>
                                    <div><b>Mensaje:</b> <i>{mostrarMensaje(inscripcion)}</i></div>
                                </div>
                            ))}
                        </div>

                        {/* Rechazados */}
                        <div className="rechazados">
                            {rechazados.map(inscripcion => (
                                <div
                                    key={inscripcion.inscriptionId}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: '5px',
                                        padding: '10px',
                                        marginBottom: '8px',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <div><b>Nombre:</b> {mostrarNombre(inscripcion)}</div>
                                    <div><b>ID:</b> {inscripcion.inscriptionId}</div>
                                    <div><b>Localidad:</b> {inscripcion.localidad || "Sin info"}</div>
                                    <div><b>Mensaje:</b> <i>{mostrarMensaje(inscripcion)}</i></div>
                                </div>
                            ))}
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
