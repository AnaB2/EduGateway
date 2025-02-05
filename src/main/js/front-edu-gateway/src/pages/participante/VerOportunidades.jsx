import { getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { useNavigate } from "react-router";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import { Dropdown, Form, Pagination } from "react-bootstrap";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import {
    getFollowedInstitutions,
    getOpportunities,
    getOpportunitiesByCategory,
    getOpportunitiesByInstitution,
    getOpportunitiesByName
} from "../../services/Api";

const filterOptions = ["Todos", "Seguidos", "Categoria", "Institucion", "Nombre"];

export function VerOportunidades() {
    const navigate = useNavigate();
    const [selectedFilterOption, setSelectedFilterOption] = useState(filterOptions[0]);
    const [searchValue, setSearchValue] = useState('');
    const [oportunidades, setOportunidades] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        if (selectedFilterOption === "Todos") {
            fetchOpportunities(page);
        } else if (selectedFilterOption === "Categoria" && searchValue) {
            fetchOpportunitiesByCategory(page, searchValue);
        }
    }, [page, selectedFilterOption, searchValue]);

    const fetchOpportunities = async (pageNumber) => {
        try {
            const response = await getOpportunities(pageNumber, pageSize);
            setOportunidades(response.opportunities || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error('Error al obtener las oportunidades:', error);
        }
    };

    const fetchOpportunitiesByCategory = async (pageNumber, category) => {
        try {
            const response = await getOpportunitiesByCategory(category, pageNumber, pageSize);
            setOportunidades(response.opportunities || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error('Error al obtener oportunidades por categoría:', error);
        }
    };

    if (!getToken() || getUserType() !== "participant") {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    const handleFilterOptionChange = async (option) => {
        setSelectedFilterOption(option);
        setSearchValue('');
        setPage(1);

        if (option === "Todos") {
            fetchOpportunities(1);
        } else if (option === "Seguidos") {
            const response = await getFollowedInstitutions();
            setOportunidades(response || []);
        }
    };

    const handleClick = async () => {
        if (selectedFilterOption === "Categoria" && searchValue) {
            fetchOpportunitiesByCategory(1, searchValue);
        } else {
            switch (selectedFilterOption) {
                case "Institucion":
                    setOportunidades(await getOpportunitiesByInstitution(searchValue) || []);
                    break;
                case "Nombre":
                    setOportunidades(await getOpportunitiesByName(searchValue) || []);
                    break;
            }
        }
    };

    // Nueva paginación minimalista con solo el número de la página y las flechas
    const renderPagination = () => {
        return (
            <Pagination>
                <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
                <Pagination.Item active>{page}</Pagination.Item>
                <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
            </Pagination>
        );
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
                                <Dropdown.Item onClick={() => handleFilterOptionChange(option)} key={index}>
                                    {option}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    {selectedFilterOption !== "Todos" && selectedFilterOption !== "Seguidos" && (
                        <Form.Group>
                            <Form.Control
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder={`Buscar por ${selectedFilterOption}`}
                                rows={1}
                            />
                        </Form.Group>
                    )}
                </div>
                {selectedFilterOption !== "Todos" && selectedFilterOption !== "Seguidos" && (
                    <div style={{ marginTop: '16px' }}>
                        <Button onClick={handleClick} variant="outline-success">
                            Buscar
                        </Button>
                    </div>
                )}
                <ContenedorOportunidadesParticipante oportunidades={oportunidades} />

                {(selectedFilterOption === "Todos" || selectedFilterOption === "Categoria") && totalPages > 1 && (
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                        {renderPagination()}
                    </div>
                )}
            </div>
        </>
    );
}
