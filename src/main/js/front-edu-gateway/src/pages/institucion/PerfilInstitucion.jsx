import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Spinner, Row, Col, Alert, Container } from "react-bootstrap";
import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarInstitucion } from "../../components/navbar/NavbarInstitucion";
import { EditarPerfilInstitucion } from "../../components/perfiles/institucion/EditarPerfilInstitucion";
import { EliminarPerfilInstitucion } from "../../components/perfiles/institucion/EliminarPerfilInstitucion";
import { getInstitutionData, getInstitutionHistory } from "../../services/Api";
import { VerHistorialInstitucion } from "../../components/perfiles/institucion/VerHistorialInstitucion";

export function PerfilInstitucion() {
    const navigate = useNavigate();
    const [institutionData, setInstitutionData] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstitutionData = async () => {
            try {
                const data = await getInstitutionData(getEmail());
                setInstitutionData(data[0]);
            } catch (error) {
                setError("Error al cargar los datos de la institución.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchInstitutionHistory = async () => {
            try {
                const data = await getInstitutionHistory(getEmail());
                setOpportunities(data);
            } catch (error) {
                console.error("Error al cargar el historial:", error);
            }
        };

        fetchInstitutionData();
        fetchInstitutionHistory();
    }, []);

    if (!getToken() || getUserType() !== "institution") {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    if (loading) {
        return <Spinner animation="border" role="status" className="d-block mx-auto mt-5" />;
    }

    if (error) {
        return <Alert variant="danger" className="text-center">{error}</Alert>;
    }

    return (
        <>
            <NavbarInstitucion />
            <Container fluid className="mt-4 bg-transparent">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <div className="p-4">
                            <h1 className="text-center mb-4">Perfil de la Institución</h1>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <p><strong>Nombre:</strong> {institutionData.institutionalName}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Correo:</strong> {institutionData.email}</p>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col>
                                    <p><strong>Descripción:</strong></p>
                                    <p>{institutionData.description || "No hay descripción disponible."}</p>
                                </Col>
                            </Row>

                            {/* ✅ Organización de botones con más separación */}
                            <div className="d-flex justify-content-between align-items-center mt-5">
                                <div className="d-flex gap-3">
                                    <EditarPerfilInstitucion actualizarInstitucion={() => {
                                        getInstitutionData(getEmail()).then(data => setInstitutionData(data[0]));
                                    }} datosAnteriores={institutionData} />

                                    <VerHistorialInstitucion opportunities={opportunities} />
                                </div>

                                <EliminarPerfilInstitucion actualizarInstitucion={() => navigate("/")} email={institutionData.email} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
