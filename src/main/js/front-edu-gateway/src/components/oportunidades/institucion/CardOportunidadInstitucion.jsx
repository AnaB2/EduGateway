import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import {deleteOpportunity} from "../../../services/Api";
import {CardFooter} from "react-bootstrap";
import {EditarOportunidad} from "./EditarOportunidad";
import {GestionarPostulaciones} from "./GestionarPostulaciones";

export function CardOportunidadInstitucion({oportunidad, actualizarOportunidades}){

    async function eliminarOportunidad(){
        await deleteOpportunity(oportunidad.name)
        actualizarOportunidades()
    }

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
                        <GestionarPostulaciones oportunidad={oportunidad}/>
                        <Button variant="danger" onClick={eliminarOportunidad}>Eliminar</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}