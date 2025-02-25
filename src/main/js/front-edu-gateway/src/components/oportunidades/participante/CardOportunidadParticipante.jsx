import Card from 'react-bootstrap/Card';
import { getInstitutionData } from "../../../services/Api";
import { Nav } from "react-bootstrap";
import { InscripcionEnOportunidad } from "./InscripcionEnOportunidad";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Cambié 'react-router' por 'react-router-dom'

export function CardOportunidadParticipante({ oportunidad, actualizarOportunidades, mostrarLink }) {

    const [institutionData, setInstitutionData] = useState(null);
    const [institutionName, setInstitutionName] = useState("");

    const getThisInstitutionData = async () => {
        try {
            const data = await getInstitutionData(oportunidad.institutionEmail);
            setInstitutionData(data[0]);
            setInstitutionName(data[0].institutionalName);
        } catch (error) {
            console.error('Error al obtener el nombre de la institución:', error);
        }
    }

    useEffect(() => {
        getThisInstitutionData();
    }, []);

    const navigate = useNavigate();

    return (
        <div className="oportunidad">
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{oportunidad.name.charAt(0).toUpperCase() + oportunidad.name.slice(1).toLowerCase()}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        {
                            mostrarLink ? (
                                    <Nav.Link onClick={() => navigate(`/ver-perfil-institucion/${institutionName}`, { state: institutionData })} onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = '#212529BF'}>
                                        {institutionName.toUpperCase()}
                                    </Nav.Link>
                                ) :
                                institutionName.toUpperCase()
                        }
                    </Card.Subtitle>
                    <Card.Text>
                        {`${oportunidad.category.toLowerCase()} en ${oportunidad.city} con modalidad ${oportunidad.modality.toLowerCase()}. El idioma requerido es ${oportunidad.language.toLowerCase()} y nivel educativo ${oportunidad.educationalLevel.toLowerCase()}. Capacidad ${oportunidad.capacity}.`}
                    </Card.Text>
                    <div className="footer-card-oportunidad">
                        <InscripcionEnOportunidad actualizarOportunidades={actualizarOportunidades} oportunidadData={oportunidad} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
