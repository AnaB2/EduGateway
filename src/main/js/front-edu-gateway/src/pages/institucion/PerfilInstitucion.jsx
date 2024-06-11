import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarInstitucion } from "../../components/navbar/NavbarInstitucion";
import { useNavigate } from "react-router";
import { EditarPerfilInstitucion } from "../../components/perfiles/institucion/EditarPerfilInstitucion";
import { EliminarPerfilInstitucion } from "../../components/perfiles/institucion/EliminarPerfilInstitucion";
import { useEffect, useState } from "react";
import { getInstitutionData, getInstitutionHistory } from "../../services/Api";

export function PerfilInstitucion() {

    // PERFIL DE INSTITUCIÓN QUE VA A VER LA INSTITUCIÓN PARA PODER EDITAR SU PERFIL

    const navigate = useNavigate();
    const [institutionData, setInstitutionData] = useState(null);
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        getInstitutionData(getEmail()).then(data => {
            setInstitutionData(data[0]);
            console.log(data);
        }).catch(error => console.error(error));

        getInstitutionHistory(getEmail()).then(data => {
            setOpportunities(data);
            console.log(data);
        }).catch(error => console.error(error));
    }, []);

    if (!getToken() || getUserType() !== "institution") {
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        );
    }

    return (
        <>
            <NavbarInstitucion />

            <div className="contenido-pagina-perfil">
                {institutionData ? (
                    <div className={"datos-perfil"}>
                        <h1>Perfil</h1>
                        <div>
                            <p>Nombre:</p>
                            <p>{institutionData.name}</p>
                        </div>
                        <div>
                            <p>Correo:</p>
                            <p>{institutionData.email}</p>
                        </div>
                    </div>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}

                {institutionData && (
                    <>
                        <EditarPerfilInstitucion
                            actualizarInstitucion={() => {
                                getInstitutionData(getEmail()).then(data => {
                                    setInstitutionData(data[0]);
                                    console.log(data);
                                }).catch(error => console.error(error));
                            }}
                            datosAnteriores={institutionData}
                        />
                        <EliminarPerfilInstitucion
                            actualizarInstitucion={() => {
                                navigate("/");
                            }}
                            email={institutionData.email}
                        />
                        <HistorialOportunidades opportunities={opportunities} />
                    </>
                )}
            </div>
        </>
    );
}

function HistorialOportunidades({ opportunities }) {
    return (
        <div className="historial-oportunidades">
            <h2>Historial de Oportunidades</h2>
            {opportunities.length > 0 ? (
                <ul>
                    {opportunities.map((opportunity) => (
                        <li key={opportunity.id}>
                            <h3>{opportunity.name}</h3>
                            <p>Categoría: {opportunity.category}</p>
                            <p>Ciudad: {opportunity.city}</p>
                            <p>Nivel Educativo: {opportunity.educationalLevel}</p>
                            <p>Modalidad: {opportunity.modality}</p>
                            <p>Idioma: {opportunity.language}</p>
                            <p>Capacidad: {opportunity.capacity}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se encontraron oportunidades.</p>
            )}
        </div>
    );
}
