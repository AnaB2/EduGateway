import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import {deleteOpportunity, followInstitution, isFollowingInstitution} from "../../../services/Api";
import {CardFooter} from "react-bootstrap";
import {EditarOportunidad} from "../institucion/EditarOportunidad";
import {InscripcionEnOportunidad} from "./InscripcionEnOportunidad";
import {useEffect, useState} from "react";

export function CardOportunidadParticipante({oportunidad, actualizarOportunidades}){

    const [isFollowing, setIsFollowing] = useState(false)

    useEffect(() => {
        const checkFollowingStatus = async () => {
            const following = await isFollowingInstitution(oportunidad.institutionEmail);
            setIsFollowing(following);
        };
        checkFollowingStatus();
    }, [oportunidad.institutionEmail]);

    const followButton = isFollowing ? <p>Siguiendo</p> : <Button variant="outline-primary" onClick={followInstitution}>Seguir</Button>;

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
                        {followButton}
                        <InscripcionEnOportunidad actualizarOportunidades={actualizarOportunidades} oportunidadData={oportunidad}/>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}