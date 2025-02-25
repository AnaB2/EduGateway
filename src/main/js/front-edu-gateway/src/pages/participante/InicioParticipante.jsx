import { getName, getToken, getUserType } from "../../services/storage";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { useNavigate } from "react-router";
import Portada from "../../components/inicio/Portada";
import { useEffect, useState } from "react";
import { getOpportunitiesFiltered } from "../../services/Api";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import { Button } from "react-bootstrap";

export function InicioParticipante() {
    const navigate = useNavigate();
    const [oportunidades, setOportunidades] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        fetchRecommendedOpportunities();
    }, [currentPage]);

    const fetchRecommendedOpportunities = async () => {
        try {
            const filters = { recommended: true, userId: getToken() }; // Filtra solo por tags del usuario
            const response = await getOpportunitiesFiltered(filters, currentPage, pageSize);
            setOportunidades(response.opportunities || []);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching recommended opportunities:", error);
        }
    };

    if (!getToken() || getUserType() !== "participant") {
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        );
    }

    return (
        <div>
            <NavbarParticipante />
            <Portada img_path={"/img/portada_participante.png"} nombre={getName()} />

            <div className="contenido-pagina-oportunidades">
                <h1 style={{ textAlign: "center", marginTop: "20px" }}>Sugerencias para Ti</h1>

                <ContenedorOportunidadesParticipante oportunidades={oportunidades} />

                {/* Paginación */}
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
            </div>
        </div>
    );
}
