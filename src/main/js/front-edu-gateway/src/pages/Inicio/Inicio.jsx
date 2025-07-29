//import {useNavigate} from 'react-router-dom';
import {ModalRegistro} from "../../components/signup/ModalRegistro";
import {LoginModal} from "../../components/login/LoginModal";

export function Inicio(){

    //const navigate = useNavigate()
    //const irARuta = (ruta) => navigate('/registro-participante')

    return(
        <div className="landing-page">
            <div className="landing-background-elements">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
                <div className="floating-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
            
            <div className="landing-container">
                <div className="landing-content">
                    <div className="landing-hero">
                        <div className="logo-container">
                            <img 
                                src={"/img/logo_horizontal.png"} 
                                alt="EduGateway Logo"
                                className="landing-logo-horizontal"
                            />
                            <div className="logo-glow"></div>
                        </div>
                        
                        <h2 className="landing-subtitle">
                            Conecta instituciones educativas con estudiantes talentosos
                        </h2>
                        <p className="landing-description">
                            Descubre oportunidades únicas de aprendizaje, voluntariado y crecimiento personal. 
                            Únete a nuestra comunidad educativa y transforma tu futuro.
                        </p>
                    </div>
                    
                    <div className="landing-actions">
                        <div className="action-buttons">
                            <ModalRegistro/>
                            <LoginModal/>
                        </div>
                        <p className="landing-help-text">
                            ¿Primera vez? Regístrate para comenzar tu experiencia educativa
                        </p>
                    </div>
                </div>
                
                <div className="landing-illustration">
                    <div className="edu-scene">
                        <div className="book-stack">
                            📚
                        </div>
                        <div className="graduation-cap">
                            🎓
                        </div>
                        <div className="light-bulb">
                            💡
                        </div>
                        <div className="rocket">
                            🚀
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}