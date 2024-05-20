import {NavbarBase} from './NavbarBase.jsx'
import {useNavigate} from "react-router";
import Nav from 'react-bootstrap/Nav';

export function NavbarParticipante() {

    const navigate = useNavigate()

    function contenido(){
        return(
            <>
                <Nav.Link style={{color:"white"}} onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = 'white'} href="/inicio-participante" >Inicio</Nav.Link>
                <Nav.Link style={{color:"white"}} onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = 'white'} href="/inicio-participante/ver-oportunidades">Oportunidades</Nav.Link>
                <Nav.Link style={{color:"white"}} onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = 'white'} href="/inicio-participante/ver-perfil">Perfil</Nav.Link>
            </>
        )
    }

    return(
        <NavbarBase contenido={contenido()}/>
    )
}

