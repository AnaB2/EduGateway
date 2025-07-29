import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import { deleteOpportunity } from "../../../services/Api";
import { CardFooter } from "react-bootstrap";
import { EditarOportunidad } from "./EditarOportunidad";
import { GestionarPostulaciones } from "./GestionarPostulaciones";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

export function CardOportunidadInstitucion({ oportunidad, actualizarOportunidades }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="oportunidad">
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{oportunidad.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{`${oportunidad.institutionEmail}`}</Card.Subtitle>
                    <Card.Text>
                        {`${oportunidad.category} en ${oportunidad.city} con modalidad ${oportunidad.modality}. El idioma requerido es ${oportunidad.language} y nivel educativo ${oportunidad.educationalLevel}. Capacidad ${oportunidad.capacity}.`}
                    </Card.Text>
                    <div className="footer-card-oportunidad">
                        <EditarOportunidad actualizarOportunidades={actualizarOportunidades} datosAnteriores={oportunidad}></EditarOportunidad>
                        <GestionarPostulaciones oportunidad={oportunidad} />
                        <Button variant="danger" onClick={() => setShowModal(true)}>Eliminar</Button>
                    </div>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro que deseas eliminar la oportunidad <b>{oportunidad.name}</b>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={async () => {
                            await deleteOpportunity(oportunidad.name);
                            setShowModal(false);
                            actualizarOportunidades();
                        }}
                    >
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
