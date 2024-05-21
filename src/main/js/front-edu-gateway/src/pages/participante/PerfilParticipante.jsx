import {getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {useNavigate} from "react-router";
import {EditarPerfilParticipante} from "../../components/perfiles/participante/EditarPerfilParticipante";
import {getData} from "../../services/Api";
import {useEffect, useState} from "react";


export function PerfilParticipante(){

    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);

    useEffect(() => { // Se ejecuta al cargar la página
        getData().then(data => { // Obtiene los datos del usuario
            setUserData(data[0]) // Guarda los datos del usuario
            console.log(data) // Muestra los datos del usuario
        }).catch(error => console.error(error)); // Muestra un error si no se pudieron obtener los datos
    }, []);

    if (!getToken() || getUserType()!=="participant"){
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        )
    }
    return(
        <>
            <NavbarParticipante></NavbarParticipante>

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


                <EditarPerfilParticipante/>
            </div>
        </>
    )
}