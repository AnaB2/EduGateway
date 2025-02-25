import { getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { useNavigate } from "react-router";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import { Dropdown, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import {
    getFollowedInstitutions,
    getOpportunities,
    getOpportunitiesByCategory,
    getOpportunitiesByInstitution,
    getOpportunitiesByName
} from "../../services/Api";

const filterOptions = [
    "Todos",
    "Seguidos",
    "Categoria",
    "Institucion",
    "Nombre",
];

const categoryOptions = ["Voluntariado", "Curso", "Programa", "Evento"];

export function VerOportunidades (){

    const navigate = useNavigate();
    const [selectedFilterOption, setSelectedFilterOption] = useState(filterOptions[0]);
    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
    const [searchValue, setSearchValue] = useState('');
    const [oportunidades, setOportunidades] = useState([]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9; // Tamaño de página

    useEffect(() => {
        fetchOpportunities();
    }, [currentPage, selectedFilterOption]); // Se ejecuta al cambiar la página o el filtro

    const fetchOpportunities = async () => {
        try {
            let response;
            switch (selectedFilterOption) {
                case "Todos":
                    response = await getOpportunities(currentPage, pageSize);
                    break;
                case "Seguidos":
                    response = await getFollowedInstitutions(currentPage, pageSize);
                    break;
                case "Categoria":
                    response = await getOpportunitiesByCategory(selectedCategory, currentPage, pageSize);
                    break;
                case "Institucion":
                    response = await getOpportunitiesByInstitution(searchValue, currentPage, pageSize);
                    break;
                case "Nombre":
                    response = await getOpportunitiesByName(searchValue, currentPage, pageSize);
                    break;
                default:
                    response = [];
            }
            setOportunidades(response || []);
        } catch (error) {
            console.error('Error al obtener las oportunidades:', error);
        }
    };

    if (!getToken() || getUserType() !== "participant") {
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        );
    }

    const handleFilterOptionChange = (option) => {
        setSelectedFilterOption(option);
        setSearchValue('');
        setCurrentPage(1); // Resetear la página cuando cambia el filtro
        fetchOpportunities();
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleClick = () => {
        fetchOpportunities();
    };

    return (
        <>
            <NavbarParticipante />
            <div className="contenido-pagina-oportunidades">
                <h1>Ver oportunidades</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {selectedFilterOption}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {filterOptions.map((option, index) => (
                                <Dropdown.Item
                                    onClick={() => handleFilterOptionChange(option)}
                                    key={index}
                                >
                                    {option}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    {selectedFilterOption === 'Categoria' && (
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-category">
                                {selectedCategory}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {categoryOptions.map((category, index) => (
                                    <Dropdown.Item
                                        onClick={() => handleCategoryChange(category)}
                                        key={index}
                                    >
                                        {category}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                    {selectedFilterOption !== 'Todos' && selectedFilterOption !== 'Seguidos' && selectedFilterOption !== 'Categoria' && (
                        <Form.Group>
                            <Form.Control
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder={`Buscar por ${selectedFilterOption}`}
                            />
                        </Form.Group>
                    )}
                </div>
                {selectedFilterOption !== 'Todos' && selectedFilterOption !== 'Seguidos' && (
                    <div style={{ marginTop: '16px' }}>
                        <Button
                            onClick={handleClick}
                            variant="outline-success"
                        >
                            Buscar
                        </Button>
                    </div>
                )}
                <ContenedorOportunidadesParticipante
                    oportunidades={oportunidades}
                />

                {/* Paginación para todos los filtros */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center", gap: "10px" }}>
                    <Button
                        variant="outline-primary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                        {"<"}
                    </Button>

                    <Dropdown>
                        <Dropdown variant="outline-primary">
                            {`${currentPage}`}
                        </Dropdown>
                    </Dropdown>

                    <Button
                        variant="outline-primary"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        {">"}
                    </Button>
                </div>
            </div>
        </>
    );
}

