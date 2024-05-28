import { getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { useNavigate } from "react-router";
import { EditarPerfilParticipante } from "../../components/perfiles/participante/EditarPerfilParticipante";
import { EliminarPerfilParticipante } from "../../components/perfiles/participante/EliminarPerfilParticipante";
import { getData } from "../../services/Api";
import { useEffect, useState } from "react";

export function PerfilParticipante() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getData().then(data => {
            setUserData(data[0]);
            console.log(data);
        }).catch(error => console.error(error));
    }, []);

    if (!getToken() || getUserType() !== "participant") {
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        );
    }

    return (
        <>
            <NavbarParticipante />

            <div className="contenido-pagina-perfil">
                {userData ? (
                    <div className={"datos-perfil"}>
                        <h1>Perfil</h1>
                        <div>
                            <p>Nombre:</p>
                            <p>{userData.firstName}</p>
                        </div>
                        <div>
                            <p>Apellido:</p>
                            <p>{userData.lastName}</p>
                        </div>
                        <div>
                            <p>Correo:</p>
                            <p>{userData.email}</p>
                        </div>
                    </div>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}

                {userData && (
                    <>
                        <EditarPerfilParticipante
                            actualizarParticipante={() => {
                                getData().then(data => {
                                    setUserData(data[0]);
                                    console.log(data);
                                }).catch(error => console.error(error));
                            }}
                            datosAnteriores={userData}
                        />
                        <EliminarPerfilParticipante
                            actualizarParticipante={() => {
                                navigate("/");
                            }}
                            email={userData.email}
                        />
                    </>
                )}
            </div>
        </>
    );
}