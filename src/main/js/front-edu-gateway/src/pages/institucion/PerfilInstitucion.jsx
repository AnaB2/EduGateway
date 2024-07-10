import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarInstitucion } from "../../components/navbar/NavbarInstitucion";
import { useNavigate } from "react-router";
import { EditarPerfilInstitucion } from "../../components/perfiles/institucion/EditarPerfilInstitucion";
import { EliminarPerfilInstitucion } from "../../components/perfiles/institucion/EliminarPerfilInstitucion";
import { useEffect, useState } from "react";
import { getInstitutionData, getInstitutionHistory } from "../../services/Api";
import { VerHistorialInstitucion } from "../../components/perfiles/institucion/VerHistorialInstitucion"; // Importar el nuevo componente

export function PerfilInstitucion() {
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
                    <div className="datos-perfil">
                        <h1>Perfil</h1>
                        <div>
                            <p>Nombre:</p>
                            <p>{institutionData.institutionalName}</p>
                        </div>
                        <div>
                            <p>Correo:</p>
                            <p>{institutionData.email}</p>
                        </div>
                        <EditarPerfilInstitucion
                            actualizarInstitucion={() => {
                                getInstitutionData(getEmail()).then(data => {
                                    setInstitutionData(data[0]);
                                    console.log(data);
                                }).catch(error => console.error(error));
                            }}
                            datosAnteriores={institutionData}
                        />
                        <VerHistorialInstitucion opportunities={opportunities} />
                    </div>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}

                {institutionData && (
                    <>
                        <EliminarPerfilInstitucion
                            actualizarInstitucion={() => {
                                navigate("/");
                            }}
                            email={institutionData.email}
                        />
                    </>
                )}
            </div>
        </>
    );
}
