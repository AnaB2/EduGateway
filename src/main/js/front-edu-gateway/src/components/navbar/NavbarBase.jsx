import {Container, Nav, Navbar} from "react-bootstrap";
import {LogoutButton} from "../logout/LogoutButton";
import BotonNotificacion from "../notificacion/BotonNotificacion";
import './navbar.css';

export function NavbarBase({contenido, onLogoClick}) {

    return(
        <Navbar expand="lg" className="modern-navbar" fixed="top">
            <Container>
                <Navbar.Brand 
                    className="navbar-brand-modern" 
                    onClick={onLogoClick}
                    style={{ cursor: 'pointer' }}
                >
                    <img 
                        src={"/img/logo_horizontal.png"} 
                        alt={"Logo Edu Gateway"} 
                        className="navbar-logo"
                    />
                </Navbar.Brand>
                
                <Navbar.Toggle 
                    aria-controls="basic-navbar-nav" 
                    className="navbar-toggler-modern"
                />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="navbar-nav-modern">
                        {contenido}
                    </Nav>
                    
                    <div className="navbar-actions">
                        <BotonNotificacion/>
                        <LogoutButton/>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
