import { useLocation } from "react-router";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import Button from "react-bootstrap/Button";
import { createPreference, followInstitution, getFollowedInstitutions, unfollowInstitution } from "../../services/Api";
import { getId } from "../../services/storage";
import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

export function PerfilPublicoInstitucion() {
    useEffect(() => {
        initMercadoPago('APP_USR-10f2b763-dca0-47a5-b329-78a3e3a2ec9a', { locale: 'es-AR' });
    }, []);

    const location = useLocation();
    const institutionData = location.state;
    const [siguiendo, setSiguiendo] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);

    async function checkFollow() {
        if (!institutionData) return;

        try {
            const response = await getFollowedInstitutions();
            console.log("Instituciones seguidas:", response);
            console.log("Institución actual:", institutionData);

            setSiguiendo(response.some(institution => institution.id === institutionData.id));
        } catch (error) {
            console.error("Error al obtener instituciones seguidas:", error);
        }
    }

    useEffect(() => {
        if (institutionData) {
            checkFollow();
        }
    }, [institutionData]);

    const follow = async () => {
        if (!institutionData) return;

        try {
            console.log("Intentando seguir a:", institutionData.id);
            const response = await followInstitution(getId(), institutionData.id);
            console.log("Respuesta de followInstitution:", response);
            await checkFollow();
        } catch (error) {
            console.error("Error en follow:", error);
        }
    };

    const unfollow = async () => {
        if (!institutionData) return;

        try {
            console.log("Intentando dejar de seguir a:", institutionData.id);
            const response = await unfollowInstitution(getId(), institutionData.id);
            console.log("Respuesta de unfollowInstitution:", response);
            await checkFollow();
        } catch (error) {
            console.error("Error en unfollow:", error);
        }
    };

    const handleDonation = async () => {
        if (!institutionData) return;

        try {
            const id = await createPreference(1000, institutionData.institutionalName);
            if (id) setPreferenceId(id.preferenceId);
        } catch (error) {
            console.error("Error al crear preferencia de pago:", error);
        }
    };

    return (
        <>
            <NavbarParticipante />
            <div className="contenido-pagina-perfil-publico">
                {institutionData ? (
                    <div>
                        <div className="datos-perfil-publico">
                            <h1>{institutionData.institutionalName.toUpperCase()}</h1>
                            <div>
                                <p>Correo:</p>
                                <p>{institutionData.email}</p>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {siguiendo ? (
                                    <Button variant="dark" onClick={unfollow}>Dejar de seguir</Button>
                                ) : (
                                    <Button variant="dark" onClick={follow}>Seguir</Button>
                                )}
                                {!preferenceId && <Button variant="success" onClick={handleDonation}>Donar</Button>}
                                {preferenceId && (
                                    <Wallet
                                        initialization={{ preferenceId, redirectMode: 'blank' }}
                                        customization={{ texts: { valueProp: 'smart_option' } }}
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <ContenedorOportunidadesParticipante institutionEmail={institutionData.email} />
                        </div>
                    </div>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}
            </div>
        </>
    );
}
