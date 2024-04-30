import {useNavigate} from "react-router";
import {NavbarBase} from "./NavbarBase";
import {Nav} from "react-bootstrap";

export function NavbarInstitucion() {

    const navigate = useNavigate()

    function contenido(){
        return(
            <>
                <Nav.Link style={{color:"white"}} onClick={()=>navigate('/inicio-institucion')} onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = 'white'}>Inicio</Nav.Link>
                <Nav.Link style={{color:"white"}} onClick={()=>navigate('/inicio-institucion/gestionar-oportunidades')} onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = 'white'}>Gestionar oportunidades</Nav.Link>
            </>
        )
    }

    return(
        <NavbarBase contenido={contenido()}/>
    )
}
