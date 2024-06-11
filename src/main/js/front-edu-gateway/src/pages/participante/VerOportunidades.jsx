import {getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {useNavigate} from "react-router";
import {ContenedorOportunidadesParticipante} from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import {Dropdown, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {
    getFollowedInstitutions,
    getOpportunities,
    getOpportunitiesByCategory,
    getOpportunitiesByInstitution, getOpportunitiesByName
} from "../../services/Api";

const filterOptions = [
    "Todos",
    "Seguidos",
    "Categoria",
    "Institucion",
    "Nombre",
];

export function VerOportunidades ({

                                  }){

    const navigate = useNavigate();
    const [selectedFilterOption, setSelectedFilterOption] = useState(filterOptions[0])
    const [searchValue, setSearchValue] = useState('')
    const [oportunidades, setOportunidades] = useState([]);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await getOpportunities();
                setOportunidades(response);
            } catch (error) {
                console.error('Error al obtener las oportunidades:', error);
            }
        };
        fetchOpportunities();
    }, []);

    if (!getToken() || getUserType()!=="participant"){
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        )
    }

    const handleFilterOptionChange = async (option) => {
        setSelectedFilterOption(option)
        setSearchValue('')
        if (option === 'Todos') {
            const response1 = await getOpportunities();
            setOportunidades(response1  ? response1 : []);
        }
        if (option === 'Seguidos') {
            const response2 = await getFollowedInstitutions();
            setOportunidades(response2 ? response2 : []);
        }
    }

    const handleClick = async () => {
        switch (selectedFilterOption) {
            case 'Todos':
                const response1 = await getOpportunities();
                setOportunidades(response1 ? response1 : []);
                break;
            case 'Seguidos':
                const response2 = await getFollowedInstitutions();
                setOportunidades(response2 ? response2 : []);
                break;
            case 'Categoria':
                const response3 = await getOpportunitiesByCategory(searchValue);
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
    }

    return(
        <>
            <NavbarParticipante></NavbarParticipante>
            <div className="contenido-pagina-oportunidades">
                <h1>Ver oportunidades</h1>
                <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {selectedFilterOption}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {filterOptions.map((option, index) =>
                                <Dropdown.Item
                                    onClick={() => handleFilterOptionChange(option)}
                                    key={index}
                                >
                                    {option}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    {selectedFilterOption !== 'Todos' && selectedFilterOption !== 'Seguidos' &&
                        <Form.Group>
                            <Form.Control
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder={`Buscar por ${selectedFilterOption}`}
                                rows={1}/>
                        </Form.Group>
                    }
                </div>
                {selectedFilterOption !== 'Todos' && selectedFilterOption !== 'Seguidos' &&
                    <div style={{marginTop: '16px'}}>
                        <Button
                            onClick={handleClick}
                            variant="outline-success"
                        >
                            Buscar
                        </Button>
                    </div>
                }
                <ContenedorOportunidadesParticipante
                    oportunidades={oportunidades}
                />
            </div>
        </>
    )
}