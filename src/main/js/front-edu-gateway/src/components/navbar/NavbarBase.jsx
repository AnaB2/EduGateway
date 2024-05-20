import {useNavigate} from "react-router-dom";
import {Container, Nav, Navbar} from "react-bootstrap";
import {LogoutButton} from "../logout/LogoutButton";

export function NavbarBase({contenido}) {

    const navigate = useNavigate()

    return(
        <Navbar expand="lg" className="bg-black">
            <Container>
                <Navbar.Brand style={{color:"white"}}>
                    <img src={"/img/logo_horizontal.png"} style={{width:'12vw'}}></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {contenido}
                    </Nav>
                    <LogoutButton></LogoutButton>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
