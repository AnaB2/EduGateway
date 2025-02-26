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

export function PerfilPublicoInstitucion() {
    useEffect(() => {
        initMercadoPago('APP_USR-10f2b763-dca0-47a5-b329-78a3e3a2ec9a', { locale: 'es-AR' });
    }, []);

    const location = useLocation();
    const institutionData = location.state;

    const [siguiendo, setSiguiendo] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");
    const [institucionesSeguidas, setInstitucionesSeguidas] = useState([]);

    // ✅ Cargar las instituciones seguidas solo cuando se monta el componente
    useEffect(() => {
        async function fetchFollowedInstitutions() {
            try {
                const response = await getFollowedInstitutions();
                if (Array.isArray(response)) {
                    setInstitucionesSeguidas(response);
                    setSiguiendo(response.some(inst => inst.id === institutionData?.id));
                }
            } catch (error) {
                console.error("Error verificando si sigue a la institución:", error);
            }
        }

        if (institutionData?.id) {
            fetchFollowedInstitutions();
        }
    }, [institutionData]);

    const follow = async () => {
        if (!institutionData?.id) return;

        // ✅ Cambia el estado localmente INMEDIATAMENTE sin esperar al backend
        setSiguiendo(true);
        setInstitucionesSeguidas(prev => [...prev, { id: institutionData.id }]);

        try {
            await followInstitution(getId().toString(), institutionData.id.toString());
        } catch (error) {
            console.error("Error al seguir la institución:", error);
            setSiguiendo(false); // 🔄 Revierte el estado si hay error
        }
    };

    const unfollow = async () => {
        if (!institutionData?.id) return;

        // ✅ Cambia el estado localmente INMEDIATAMENTE sin esperar al backend
        setSiguiendo(false);
        setInstitucionesSeguidas(prev => prev.filter(inst => inst.id !== institutionData.id));

        try {
            await unfollowInstitution(getId().toString(), institutionData.id.toString());
        } catch (error) {
            console.error("Error al dejar de seguir la institución:", error);
            setSiguiendo(true); // 🔄 Revierte el estado si hay error
        }
    };

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
                            <h1 className="text-center">{institutionData.institutionalName.toUpperCase()}</h1>
                            <div className="text-center">
                                <p><strong>Correo:</strong> {institutionData.email}</p>
                            </div>
                            <div className="d-flex flex-column align-items-center mt-3">
                                {siguiendo ? (
                                    <Button variant="dark" onClick={unfollow}>Dejar de seguir</Button>
                                ) : (
                                    <Button variant="dark" onClick={follow}>Seguir</Button>
                                )}

                                {/* Input para ingresar monto de donación */}
                                <input
                                    type="number"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    placeholder="Monto a donar"
                                    className="form-control mt-3 w-50 text-center"
                                />

                                {!preferenceId && (
                                    <Button variant="success" onClick={handleDonation} className="mt-2">Donar</Button>
                                )}
                                {preferenceId && (
                                    <div className="mt-2">
                                        <Wallet
                                            initialization={{ preferenceId, redirectMode: 'blank' }}
                                            customization={{ texts: { valueProp: 'smart_option' } }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <ContenedorOportunidadesParticipante institutionEmail={institutionData.email} />
                        </div>
                    </div>
                ) : (
                    <p className="text-center mt-4">Cargando datos del perfil...</p>
                )}
            </div>
        </>
    );
}
