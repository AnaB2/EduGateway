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
    }, [currentPage]); // Se ejecuta cuando cambia la página

    const fetchOpportunities = async () => {
        try {
            if (selectedFilterOption === "Todos") {
                const response = await getOpportunities(currentPage, pageSize);
                setOportunidades(response);
            }
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

    const handleFilterOptionChange = async (option) => {
        setSelectedFilterOption(option);
        setSearchValue('');
        setCurrentPage(1); // Resetear la página cuando cambia el filtro
        if (option === 'Todos') {
            fetchOpportunities();
        }
        if (option === 'Seguidos') {
            const response = await getFollowedInstitutions();
            setOportunidades(response ? response : []);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleClick = async () => {
        switch (selectedFilterOption) {
            case 'Todos':
                fetchOpportunities();
                break;
            case 'Seguidos':
                const response2 = await getFollowedInstitutions();
                setOportunidades(response2 ? response2 : []);
                break;
            case 'Categoria':
                const response3 = await getOpportunitiesByCategory(selectedCategory);
                setOportunidades(response3 ? response3 : []);
                break;
            case 'Institucion':
                const response4 = await getOpportunitiesByInstitution(searchValue);
                setOportunidades(response4 ? response4 : []);
                break;
            case 'Nombre':
                const response5 = await getOpportunitiesByName(searchValue);
                setOportunidades(response5 ? response5 : []);
                break;
        }
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

                {/* Paginación solo para "Todos" */}
                {selectedFilterOption === "Todos" && (
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
                )}
            </div>
        </>
    );
}
