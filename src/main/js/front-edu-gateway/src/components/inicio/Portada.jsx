import './portada.css'
import { getUserType } from '../../services/storage'

export default function Portada({nombre, img_path}){
    const userType = getUserType();
    const isInstitution = userType === 'institution';
    
    // Personalizar contenido según el tipo de usuario
    const heroContent = {
        title: isInstitution ? "Conecta con el Futuro" : "Descubre tu Potencial",
        subtitle: `Hola, ${nombre}`,
        description: isInstitution 
            ? "Publica oportunidades educativas y encuentra el talento que necesitas para crecer juntos."
            : "Explora oportunidades únicas de aprendizaje y voluntariado que transformarán tu futuro.",
        primaryAction: isInstitution ? "Gestionar Oportunidades" : "Explorar Oportunidades",
        secondaryAction: isInstitution ? "Ver Postulaciones" : "Mi Perfil"
    };

    const handlePrimaryAction = () => {
        if (isInstitution) {
            window.location.href = '/inicio-institucion/gestionar-oportunidades';
        } else {
            window.location.href = '/inicio-participante/ver-oportunidades';
        }
    };

    const handleSecondaryAction = () => {
        if (isInstitution) {
            window.location.href = '/inicio-institucion/gestionar-oportunidades';
        } else {
            window.location.href = '/inicio-participante/ver-perfil';
        }
    };

    return(
        <div className="hero-container">
            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">{heroContent.title}</h1>
                    <h2 className="hero-subtitle">{heroContent.subtitle}</h2>
                    <p className="hero-description">{heroContent.description}</p>
                    
                    <div className="hero-actions">
                        <button 
                            className="btn-primary" 
                            onClick={handlePrimaryAction}
                        >
                            {heroContent.primaryAction}
                        </button>
                        <button 
                            className="btn-secondary" 
                            onClick={handleSecondaryAction}
                        >
                            {heroContent.secondaryAction}
                        </button>
                    </div>
                </div>
                
                <div className="hero-image">
                    <img src={img_path} alt="Ilustración de EduGateway" />
                    <div className="image-decoration"></div>
                </div>
            </div>
            
            {/* Elementos decorativos */}
            <div className="hero-decoration">
                <div className="floating-element element-1"></div>
                <div className="floating-element element-2"></div>
                <div className="floating-element element-3"></div>
            </div>
        </div>
    )
}