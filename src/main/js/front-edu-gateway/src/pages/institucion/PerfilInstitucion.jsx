import {getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {useNavigate} from "react-router";
import {EditarPerfilInstitucion} from "../../components/perfiles/institucion/EditarPerfilInstitucion";
import {NavbarInstitucion} from "../../components/navbar/NavbarInstitucion";
import {getData} from "../../services/Api";
import {useEffect, useState} from "react";


export function PerfilInstitucion(){

    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);

    useEffect(() => { // Se ejecuta al cargar la página
        getData().then(data => { // Obtiene los datos del usuario
            setUserData(data[0]) // Guarda los datos del usuario
            console.log(data) // Muestra los datos del usuario
        }).catch(error => console.error(error)); // Muestra un error si no se pudieron obtener los datos
    }, []);


    if (!getToken() || getUserType()!=="institution"){
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        )
    }
    return(
        <>
            <NavbarInstitucion></NavbarInstitucion>

            <div className="contenido-pagina">

                {userData ? (
                    <div className={"datosPerfil"}>
                        <h1>Perfil</h1>
                        <div>
                            <p>Nombre Institucional:</p>
                            <p>{userData.institutionalName}</p>
                        </div>
                        <div>
                            <p>Correo:</p>
                            <p>{userData.email}</p>
                        </div>
                    </div>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}

                 <EditarPerfilInstitucion/>
            </div>
        </>
    )
}