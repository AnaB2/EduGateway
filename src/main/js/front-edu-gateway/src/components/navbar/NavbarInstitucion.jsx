import {useNavigate} from "react-router";
import {NavbarBase} from "./NavbarBase";
import {Nav} from "react-bootstrap";

export function NavbarInstitucion() {

    const navigate = useNavigate()

    const handleLogoClick = () => {
        navigate('/inicio-institucion');
    };

    function contenido(){
        return(
            <>
                <Nav.Link 
                    className="nav-link-modern" 
                    onClick={() => navigate('/inicio-institucion')}
                >
                    Inicio
                </Nav.Link>
                <Nav.Link 
                    className="nav-link-modern" 
                    onClick={() => navigate('/inicio-institucion/gestionar-oportunidades')}
                >
                    Gestionar oportunidades
                </Nav.Link>
                <Nav.Link 
                    className="nav-link-modern" 
                    onClick={() => navigate('/donaciones')}
                >
                    Donaciones
                </Nav.Link>
                <Nav.Link 
                    className="nav-link-modern" 
                    onClick={() => navigate('/chats')}
                >
                    Chats
                </Nav.Link>
                <Nav.Link 
                    className="nav-link-modern" 
                    onClick={() => navigate('/inicio-institucion/ver-perfil-institucion')}
                >
                    Perfil
                </Nav.Link>
            </>
        )
    }

    return(
        <NavbarBase contenido={contenido()} onLogoClick={handleLogoClick}/>
    )
}
