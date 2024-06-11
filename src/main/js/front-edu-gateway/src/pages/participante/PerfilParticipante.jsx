import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { useNavigate } from "react-router";
import { EditarPerfilParticipante } from "../../components/perfiles/participante/EditarPerfilParticipante";
import { EliminarPerfilParticipante } from "../../components/perfiles/participante/EliminarPerfilParticipante";
import { useEffect, useState } from "react";
import { getUserData, getUserHistory } from "../../services/Api";
import { VerHistorialParticipante } from "../../components/perfiles/participante/VerHistorialParticipante";

export function PerfilParticipante() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);

    useEffect(() => {
        getUserData(getEmail()).then(data => {
            setUserData(data[0]);
            console.log(data);
        }).catch(error => console.error(error));

        getUserHistory(getEmail()).then(data => {
            setInscriptions(data);
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
                        <EditarPerfilParticipante
                            actualizarParticipante={() => {
                                getUserData(getEmail()).then(data => {
                                    setUserData(data[0]);
                                    console.log(data);
                                }).catch(error => console.error(error));
                            }}
                            datosAnteriores={userData}
                        />
                        <VerHistorialParticipante inscriptions={inscriptions} />
                    </div>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}

                {userData && (
                    <>
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
