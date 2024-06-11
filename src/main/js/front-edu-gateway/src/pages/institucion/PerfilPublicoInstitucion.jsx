import {useLocation} from "react-router";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {ContenedorOportunidadesParticipante} from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import Button from "react-bootstrap/Button";
import {followInstitution, getFollowedInstitutions, unfollowInstitution} from "../../services/Api";
import {getId} from "../../services/storage";
import {useEffect, useState} from "react";


export function PerfilPublicoInstitucion(){

    // PERFIL DE INSTITUCIÓN QUE VAN A VER LOS PARTICIPANTES

    const location = useLocation();
    const institutionData = location.state;

    const [siguiendo, setSiguiendo] = useState(false);

    async function checkFollow(){
        const response = await getFollowedInstitutions();
        if (response.some(institution => institution.id === institutionData.id)){
            setSiguiendo(true);
        } else {
            setSiguiendo(false);
        }
    }

    useEffect(() => {
        checkFollow();
    }, []);

    const follow = async ()=>{
        try {
            const response = await followInstitution(getId(), institutionData.id);
            console.log(response);
            await checkFollow();
        } catch (error) {
            console.error(error);
        }
    }

    const unfollow = async () => {
        try{
            const response = await unfollowInstitution(getId(), institutionData.id);
            console.log(response);
            await checkFollow();
        } catch (e){
            console.error(e);
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
                            {siguiendo ? <Button variant="dark" onClick={unfollow}>dejar de seguir</Button> : <Button variant="dark" onClick={follow}>seguir</Button>}
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