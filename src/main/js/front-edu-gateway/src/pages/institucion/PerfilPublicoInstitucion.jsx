import {useLocation} from "react-router";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {ContenedorOportunidadesParticipante} from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import Button from "react-bootstrap/Button";
import {followInstitution} from "../../services/Api";
import {getId} from "../../services/storage";
import {useState} from "react";


export function PerfilPublicoInstitucion(){

    // PERFIL DE INSTITUCIÓN QUE VAN A VER LOS PARTICIPANTES

    const location = useLocation();
    const institutionData = location.state;
    console.log(institutionData);

    const [siguiendo, setSiguiendo] = useState(false);

    const follow = async ()=>{
        try {
            const response = await followInstitution(getId(), institutionData.id);
            console.log(response);
            setSiguiendo(true); // cuando esté la lógica de ver seguidos cambiar la forma de hacer esto
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <>
            <NavbarParticipante/>
            <div className="contenido-pagina-perfil-publico">
                {institutionData ? (
                    <div>
                        <div className={"datos-perfil-publico"}>
                            <h1>{institutionData.institutionalName.toUpperCase()}</h1>
                            <div>
                                <p>Correo:</p>
                                <p>{institutionData.email}</p>
                            </div>
                            {siguiendo ? <p>Siguiendo</p> : <Button variant="dark" onClick={follow}>seguir</Button>}
                        </div>
                        <div>
                            <ContenedorOportunidadesParticipante institutionEmail={institutionData.email}/>
                        </div>
                    </div>

                ) : (
                    <p>Cargando datos del perfil...</p>
                )}
            </div>
        </>
    )
}