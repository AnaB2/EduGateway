import { getId,getName, getToken, getUserType, getEmail } from "../../services/storage";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { useNavigate } from "react-router";
import Portada from "../../components/inicio/Portada";
import { useEffect, useState } from "react";
import { getRecommendedOpportunities, getUserData } from "../../services/Api";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import { Button, Spinner, Alert } from "react-bootstrap";


export function InicioParticipante() {
    const navigate = useNavigate();
    const [oportunidades, setOportunidades] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [userTags, setUserTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const pageSize = 9;

    useEffect(() => {
        fetchUserTags();
    }, []);

    useEffect(() => {
        if (userTags.length > 0) {
            fetchRecommendedOpportunities();
        }
    }, [currentPage, userTags]);

    // ✅ Obtiene los tags del usuario desde su perfil
    const fetchUserTags = async () => {
        try {
            const userEmail = getEmail();
            const response = await getUserData(userEmail);
            if (response.length > 0 && response[0].preferredTags) {
                setUserTags(response[0].preferredTags);
            }
        } catch (error) {
            console.error("Error fetching user tags:", error);
        }
    };

    // ✅ Obtiene oportunidades con tags en común con el usuario
    const fetchRecommendedOpportunities = async () => {
        try {
            setLoading(true);

            // ✅ Usar getId() en lugar de getToken()
            const userId = getId();
            console.log("User ID obtenido:", userId); // ✅ Verificar si es correcto

            if (!userId || isNaN(userId) || userId <= 0) {
                throw new Error("User ID is not a valid number");
            }

            const response = await getRecommendedOpportunities(userId);

            console.log("Oportunidades recibidas:", response); // ✅ Verificar en consola

            if (Array.isArray(response)) {
                setOportunidades(response);
            } else {
                console.error("El backend no devolvió un array:", response);
                setOportunidades([]);
            }

            setTotalPages(1);
        } catch (error) {
            console.error("Error fetching recommended opportunities:", error);
        } finally {
            setLoading(false);
        }
    };



    if (!getToken() || getUserType() !== "participant") {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    return (
        <div>
            <NavbarParticipante />
            <Portada img_path={"/img/portada_participante.png"} nombre={getName()} />

            <div className="contenido-pagina-oportunidades">
                <h1 style={{ textAlign: "center", marginTop: "20px" }}>Sugerencias para Ti</h1>

                {console.log("Estado de oportunidades:", oportunidades)} {/* ✅ Verifica si el estado cambia */}

                {loading ? (
                    <Spinner animation="border" role="status" className="d-block mx-auto mt-3" />
                ) : oportunidades.length === 0 ? (
                    <Alert variant="warning" className="text-center mt-3">
                        No hay oportunidades recomendadas en base a tus preferencias.
                    </Alert>
                ) : (
                    <ContenedorOportunidadesParticipante oportunidades={oportunidades} />
                )}

                {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
                        <Button
                            variant="outline-primary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            {"<"}
                        </Button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <Button
                            variant="outline-primary"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            {">"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
