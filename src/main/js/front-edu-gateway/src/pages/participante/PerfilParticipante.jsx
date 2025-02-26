import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Spinner, Row, Col, Alert, Container } from "react-bootstrap";
import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { EditarPerfilParticipante } from "../../components/perfiles/participante/EditarPerfilParticipante";
import { EliminarPerfilParticipante } from "../../components/perfiles/participante/EliminarPerfilParticipante";
import { getUserData, getUserHistory, updateUserTags } from "../../services/Api";
import { VerHistorialParticipante } from "../../components/perfiles/participante/VerHistorialParticipante";

const allTags = [
    "Programación", "Matemáticas", "Ciencia", "Literatura", "Idiomas",
    "Arte", "Música", "Negocios", "Salud", "Deportes", "Tecnología", "Universidad"
];

export function PerfilParticipante() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData(getEmail());
                setUserData(data[0]);

                // Ensure preferredTags is an array
                const tags = Array.isArray(data[0].preferredTags) ? data[0].preferredTags : [];
                setSelectedTags(tags);
            } catch (error) {
                setError("Error loading profile data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserHistory = async () => {
            try {
                const data = await getUserHistory(getEmail());
                setInscriptions(data);
            } catch (error) {
                console.error("Error loading history:", error);
            }
        };

        fetchUserData();
        fetchUserHistory();
    }, []);

    const handleTagSelection = (tag) => {
        setSelectedTags(selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag]);
    };

    const handleSaveTags = useCallback(async () => {
        setSaving(true);
        try {
            await updateUserTags(getEmail(), selectedTags);
            alert("Preferencias actualizadas correctamente");
        } catch (error) {
            console.error("Error updating tags:", error);
            alert("Error al actualizar las preferencias.");
        } finally {
            setSaving(false);
        }
    }, [selectedTags]);

    if (!getToken() || getUserType() !== "participant") {
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
            <NavbarParticipante />
            <Container fluid className="mt-4 bg-transparent">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <div className="p-4">
                            <h1 className="text-center mb-4">Perfil del Participante</h1>
                            <Row>
                                <Col md={6}>
                                    <p><strong>Nombre:</strong> {userData.firstName}</p>
                                    <p><strong>Apellido:</strong> {userData.lastName}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Correo:</strong> {userData.email}</p>
                                    <p><strong>Descripción:</strong> {userData.description}</p>
                                </Col>
                            </Row>

                            <h3 className="mt-4">Preferencias</h3>
                            <Form>
                                <Row>
                                    {allTags.map(tag => (
                                        <Col key={tag} xs={6} md={4} lg={3} className="mb-2">
                                            <Form.Check
                                                type="checkbox"
                                                label={tag}
                                                checked={selectedTags.includes(tag)}
                                                onChange={() => handleTagSelection(tag)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Form>
                            <Button
                                variant="success"
                                onClick={handleSaveTags}
                                className="mt-3 mb-4 w-100"
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Guardar Preferencias"}
                            </Button>

                            <div className="d-flex justify-content-between mt-4">
                                <div className="d-flex gap-3">
                                    <EditarPerfilParticipante actualizarParticipante={() => {
                                        getUserData(getEmail()).then(data => setUserData(data[0]));
                                    }} datosAnteriores={userData}/>

                                    <VerHistorialParticipante inscriptions={inscriptions}/>
                                </div>

                                <EliminarPerfilParticipante actualizarParticipante={() => navigate("/")}
                                                            email={userData.email}/>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
