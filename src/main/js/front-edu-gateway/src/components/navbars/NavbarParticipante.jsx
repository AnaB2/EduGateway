import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
//import NavDropdown from 'react-bootstrap/NavDropdown';
import {LogoutButton} from "../logoutButton/LogoutButton";

export function NavbarParticipante() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">EduGateway</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/inicio-participante">Inicio</Nav.Link>
                        <Nav.Link href="/inicio-participante/ver-oportunidades">Oportunidades</Nav.Link>
                    </Nav>
                    <LogoutButton></LogoutButton>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
