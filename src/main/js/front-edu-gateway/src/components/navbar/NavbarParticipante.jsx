import {NavbarBase} from './NavbarBase.jsx'
import {useNavigate} from "react-router";
import Nav from 'react-bootstrap/Nav';

export function NavbarParticipante() {

    const navigate = useNavigate()

    const handleLogoClick = () => {
        navigate('/inicio-participante');
    };

    function contenido(){
        return(
            <>
                <Nav.Link 
                    className="nav-link-modern" 
                    onClick={() => navigate('/inicio-participante')}
                >
                    Inicio
                </Nav.Link>
                <Nav.Link 
                    className="nav-link-modern" 
                    onClick={() => navigate('/inicio-participante/ver-oportunidades')}
                >
                    Oportunidades
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
                    onClick={() => navigate('/inicio-participante/ver-perfil')}
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

