import { getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarInstitucion } from "../../components/navbar/NavbarInstitucion";
import { useNavigate } from "react-router";
import { ContenedorOportunidadesInstitucion } from "../../components/oportunidades/institucion/ContenedorOportunidadesInstitucion";

export function GestionarOportunidades() {
    const navigate = useNavigate();

    if (!getToken() || getUserType() !== "institution") {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    return (
        <>
            <NavbarInstitucion />
            <div className="contenido-pagina-oportunidades">
                <h1>Gestionar Oportunidades</h1>
                <p className="lead text-center mb-4" style={{
                    color: '#6b7280',
                    fontSize: '1.1rem',
                    maxWidth: '600px',
                    margin: '0 auto 40px'
                }}>
                    Administra tus oportunidades educativas y conecta con estudiantes talentosos
                </p>
                <ContenedorOportunidadesInstitucion />
            </div>
        </>
    );
}