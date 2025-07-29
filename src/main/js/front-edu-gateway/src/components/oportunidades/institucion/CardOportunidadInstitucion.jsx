import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import {deleteOpportunity} from "../../../services/Api";
import {CardFooter} from "react-bootstrap";
import {EditarOportunidad} from "./EditarOportunidad";
import {GestionarPostulaciones} from "./GestionarPostulaciones";
import {VerHistorialInstitucion} from "../../perfiles/institucion/VerHistorialInstitucion";

export function CardOportunidadInstitucion({oportunidad, actualizarOportunidades}){

    async function eliminarOportunidad(){
        if (window.confirm(`¿Estás seguro de que deseas eliminar la oportunidad "${oportunidad.name}"?`)) {
            await deleteOpportunity(oportunidad.name)
            actualizarOportunidades()
        }
    }

    return (
        <div className="oportunidad" data-category={oportunidad.category}>
            <Card>
                <Card.Body>
                    <Card.Title>{oportunidad.name.charAt(0).toUpperCase() + oportunidad.name.slice(1).toLowerCase()}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{`${oportunidad.institutionEmail}`}</Card.Subtitle>
                    <Card.Text>
                        {`${oportunidad.category} en ${oportunidad.city} con modalidad ${oportunidad.modality.toLowerCase()}. El idioma requerido es ${oportunidad.language.toLowerCase()} y nivel educativo ${oportunidad.educationalLevel.toLowerCase()}. Capacidad ${oportunidad.capacity}.`}
                    </Card.Text>
                    <div className="footer-card-oportunidad">
                        <EditarOportunidad 
                            actualizarOportunidades={actualizarOportunidades} 
                            datosAnteriores={oportunidad}
                            className="btn btn-secondary"
                        />
                        <GestionarPostulaciones 
                            oportunidad={oportunidad}
                            className="btn btn-secondary"
                        />
                        <Button variant="danger" onClick={eliminarOportunidad}>
                            Eliminar
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}