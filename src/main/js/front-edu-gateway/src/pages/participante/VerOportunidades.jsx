import { getToken, getUserType, getId } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { useNavigate } from "react-router";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import { Form, Container } from "react-bootstrap";
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
    const [loading, setLoading] = useState(false);
    const pageSize = 9;

    useEffect(() => {
        fetchOpportunities();
    }, [currentPage]);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const filters = {
                category: followed ? "" : category,
                institution,
                name,
                followed,
                userId: followed ? getId() : "",
            };

            const response = await getOpportunitiesFiltered(filters, currentPage, pageSize);
            setOportunidades(response.opportunities || []);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchOpportunities();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (!getToken() || getUserType() !== "participant") {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    return (
        <>
            <NavbarParticipante />
            <div className="contenido-pagina-oportunidades">
                <h1>Descubre Oportunidades</h1>
                
                {/* Enhanced Filters Section */}
                <div className="filters-container">
                    <div className="filters-row">
                        <div className="filter-group">
                            <label>Categoría</label>
                            <Form.Select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={followed}
                            >
                                <option value="">Todas las categorías</option>
                                <option value="Voluntariado">Voluntariado</option>
                                <option value="Curso">Curso</option>
                                <option value="Programa">Programa</option>
                                <option value="Evento">Evento</option>
                            </Form.Select>
                        </div>

                        <div className="filter-group">
                            <label>Institución</label>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por institución..."
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={followed}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Oportunidad</label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre de la oportunidad..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={followed}
                            />
                        </div>

                        <div className="filter-group">
                            <label>&nbsp;</label>
                            <Button 
                                className="btn-search" 
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">Buscando...</span>
                                        </div>
                                        Buscando...
                                    </>
                                ) : (
                                    'Buscar'
                                )}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Toggle for followed institutions */}
                    <div className="custom-switch">
                        <Form.Check
                            type="switch"
                            id="followed-switch"
                            label="Solo mostrar de instituciones que sigo"
                            checked={followed}
                            onChange={(e) => {
                                setFollowed(e.target.checked);
                                if (e.target.checked) {
                                    setCategory("");
                                    setInstitution("");
                                    setName("");
                                }
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando oportunidades...</span>
                        </div>
                        <div className="loading-text">Buscando las mejores oportunidades para ti...</div>
                    </div>
                ) : oportunidades.length === 0 ? (
                    // Empty State
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        <h3>No hay oportunidades disponibles</h3>
                        <p>
                            {followed 
                                ? "No encontramos oportunidades de las instituciones que sigues. Intenta seguir más instituciones o desactiva este filtro."
                                : "No se encontraron oportunidades que coincidan con tus criterios de búsqueda. Intenta ajustar los filtros."
                            }
                        </p>
                    </div>
                ) : (
                    <ContenedorOportunidadesParticipante oportunidades={oportunidades} />
                )}

                {/* Enhanced Pagination */}
                {totalPages > 1 && !loading && (
                    <div className="pagination-container">
                        <Button
                            variant="outline-primary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            ← Anterior
                        </Button>
                        
                        <div className="pagination-info">
                            Página {currentPage} de {totalPages}
                        </div>
                        
                        <Button
                            variant="outline-primary"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Siguiente →
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
