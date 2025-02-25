import { useLocation } from "react-router";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import Button from "react-bootstrap/Button";
import {
    createPreference,
    followInstitution,
    getFollowedInstitutions,
    saveDonation,
    unfollowInstitution
} from "../../services/Api";
import { getId } from "../../services/storage";
import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";

export function PerfilPublicoInstitucion() {

    useEffect(() => {
        initMercadoPago('APP_USR-10f2b763-dca0-47a5-b329-78a3e3a2ec9a', { locale: 'es-AR' });
    }, []);

    // PERFIL DE INSTITUCIÓN QUE VAN A VER LOS PARTICIPANTES

    const location = useLocation();
    const institutionData = location.state;

    const [siguiendo, setSiguiendo] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);
    const [donationAmount, setDonationAmount] = useState(""); // Estado para el monto de donación

    async function checkFollow() {
        const response = await getFollowedInstitutions();
        if (response.some(institution => institution.id === institutionData.id)) {
            setSiguiendo(true);
        } else {
            setSiguiendo(false);
        }
    }

    useEffect(() => {
        checkFollow();
    }, []);

    const follow = async () => {
        try {
            await followInstitution(getId(), institutionData.id);
            await checkFollow();
        } catch (error) {
            console.error(error);
        }
    }

    const unfollow = async () => {
        try {
            await unfollowInstitution(getId(), institutionData.id);
            await checkFollow();
        } catch (e) {
            console.error(e);
        }
    }


    const handleDonation = async () => {
        if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
            alert("Por favor, ingrese un monto válido para donar.");
            return;
        }

        try {
            const id = await createPreference(donationAmount, institutionData.institutionalName);
            if (id) {
                setPreferenceId(id.preferenceId);
                await saveDonation(getId(), institutionData.id, donationAmount);
                console.log(`Donación de $${donationAmount} registrada en la base de datos.`);
            }
        } catch (error) {
            console.error("Error al procesar la donación:", error);
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
                                {siguiendo ?
                                    <Button variant="dark" onClick={unfollow}>Dejar de seguir</Button> :
                                    <Button variant="dark" onClick={follow}>Seguir</Button>
                                }

                                {/* Input para ingresar monto de donación */}
                                <input
                                    type="number"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    placeholder="Monto a donar"
                                    style={{ margin: "10px", padding: "5px", textAlign: "center" }}
                                />

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
