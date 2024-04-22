import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {LogoutButton} from "../logoutButton/LogoutButton";

export function NavbarInstitucion() {

    return(
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Gestionar oportunidades</Nav.Link>
                        <Nav.Link href="#link">Mi perfil</Nav.Link>
                    </Nav>
                    <LogoutButton></LogoutButton>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
