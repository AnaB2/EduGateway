import {useLocation} from "react-router";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {ContenedorOportunidadesParticipante} from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import Button from "react-bootstrap/Button";
import {createPreference, followInstitution, getFollowedInstitutions, unfollowInstitution} from "../../services/Api";
import {getId} from "../../services/storage";
import {useEffect, useState} from "react";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from "axios";

export function PerfilPublicoInstitucion(){

    useEffect(() => {
        initMercadoPago('APP_USR-10f2b763-dca0-47a5-b329-78a3e3a2ec9a', { locale: 'es-AR' });
    }, []);

    // PERFIL DE INSTITUCIÓN QUE VAN A VER LOS PARTICIPANTES

    const location = useLocation();
    const institutionData = location.state;

    const [siguiendo, setSiguiendo] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);

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

    const handleDonation = async () => {
        const id = await createPreference(1000, institutionData.institutionalName)
        if(id) setPreferenceId(id.preferenceId)
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
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                                {siguiendo ? <Button variant="dark" onClick={unfollow}>dejar de seguir</Button> : <Button variant="dark" onClick={follow}>seguir</Button>}
                                {!preferenceId && <Button variant="success" onClick={handleDonation}>donar</Button>}
                                {preferenceId && (
                                    <Wallet
                                        initialization={{ preferenceId, redirectMode: 'blank' }}
                                        customization={{ texts: { valueProp: 'smart_option' } }}
                                    />
                                )}                            </div>
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