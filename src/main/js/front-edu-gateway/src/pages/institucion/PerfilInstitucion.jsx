import { getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarInstitucion } from "../../components/navbar/NavbarInstitucion";
import { useNavigate } from "react-router";
import { EditarPerfilInstitucion } from "../../components/perfiles/institucion/EditarPerfilInstitucion";
import { EliminarPerfilInstitucion } from "../../components/perfiles/institucion/EliminarPerfilInstitucion";
import { getData } from "../../services/Api";
import { useEffect, useState } from "react";

export function PerfilInstitucion() {
    const navigate = useNavigate();
    const [institutionData, setInstitutionData] = useState(null);

    useEffect(() => {
        getData().then(data => {
            setInstitutionData(data[0]);
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
                                getData().then(data => {
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
                    </>
                )}
            </div>
        </>
    );
}
