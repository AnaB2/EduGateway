import { getToken, getUserType, getId } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { useNavigate } from "react-router";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import { Dropdown, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { getOpportunitiesFiltered } from "../../services/Api";

export function VerOportunidades() {
    const navigate = useNavigate();
    const [category, setCategory] = useState("");
    const [institution, setInstitution] = useState("");
    const [name, setName] = useState("");
    const [followed, setFollowed] = useState(false);
    const [oportunidades, setOportunidades] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        fetchOpportunities();
    }, [currentPage]);

    const fetchOpportunities = async () => {
        try {
            const filters = {
                category: followed ? "" : category, // Si "Seguidos" está activado, no filtrar por categoría
                institution,
                name,
                followed,
                userId: followed ? getId() : "", // Enviar userId solo si "Seguidos" está activado
            };

            const response = await getOpportunitiesFiltered(filters, currentPage, pageSize);
            setOportunidades(response.opportunities || []);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        }
    };

    const handleCategoryChange = (selectedCategory) => {
        if (selectedCategory === "Seguidos") {
            setFollowed(true);
            setCategory("");
            setInstitution("");
            setName("");
        } else {
            setFollowed(false);
            setCategory(selectedCategory);
        }
        setCurrentPage(1); // Reiniciar a la página 1 al cambiar categoría
        fetchOpportunities();
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchOpportunities();
    };

    return (
        <>
            <NavbarParticipante />
            <div className="contenido-pagina-oportunidades">
                <h1>Oportunidades</h1>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                    {/* Dropdown de Categoría (incluye "Seguidos") */}
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                            {followed ? "Seguidos" : category || "Categoría"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {["", "Voluntariado", "Curso", "Programa", "Evento", "Seguidos"].map((cat, index) => (
                                <Dropdown.Item key={index} onClick={() => handleCategoryChange(cat)}>
                                    {cat || "Todas"}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Form.Control
                        placeholder="Institución"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        disabled={followed} // Deshabilita cuando "Seguidos" está activado
                    />
                    <Form.Control
                        placeholder="Nombre de oportunidad"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={followed} // Deshabilita cuando "Seguidos" está activado
                    />

                    <Button variant="outline-success" onClick={handleSearch}>
                        Buscar
                    </Button>
                </div>

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
        </>
    );
}
