import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {LogoutButton} from "../logoutButton/LogoutButton";
import {useNavigate} from "react-router";

export function NavbarInstitucion() {

    const navigate = useNavigate()

    return(
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">EduGateway</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={()=>navigate('/inicio-institucion')}>Inicio</Nav.Link>
                        <Nav.Link onClick={()=>navigate('/inicio-institucion/gestionar-oportunidades')}>Gestionar oportunidades</Nav.Link>
                    </Nav>
                    <LogoutButton></LogoutButton>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
