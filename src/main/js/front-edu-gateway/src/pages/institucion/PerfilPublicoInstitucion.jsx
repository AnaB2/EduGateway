import { useLocation, useNavigate } from "react-router";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { ContenedorOportunidadesParticipante } from "../../components/oportunidades/participante/ContenedorOportunidadesParticipante";
import Button from "react-bootstrap/Button";
import {
    createPreference,
    followInstitution,
    getFollowedInstitutions,
    saveDonation,
    unfollowInstitution,
    createChat
} from "../../services/Api";
import { getId } from "../../services/storage";
import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

export function PerfilPublicoInstitucion() {
    const navigate = useNavigate();
    
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

    // 💬 Nueva función para manejar mensajes
    const handleSendMessage = async () => {
        if (!institutionData?.email) {
            alert("Error: No se pudo obtener la información de la institución.");
            return;
        }

        try {
            console.log("💬 Creating/opening chat with institution:", institutionData.email);
            
            const chatResponse = await createChat(institutionData.email, getId());
            
            if (chatResponse.chatId) {
                console.log(`💬 ${chatResponse.existed ? 'Opening existing' : 'Created new'} chat with ID:`, chatResponse.chatId);
                
                // Navegar a la página de chats con el chat específico seleccionado
                navigate('/chats', { 
                    state: { 
                        selectedChatId: chatResponse.chatId,
                        institutionName: institutionData.institutionalName
                    } 
                });
            } else {
                alert("Error al crear el chat. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al crear/abrir chat:", error);
            alert("Error al abrir el chat. Inténtalo de nuevo.");
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
                                <div className="d-flex gap-2 mb-3">
                                    {siguiendo ? (
                                        <Button variant="dark" onClick={unfollow}>Dejar de seguir</Button>
                                    ) : (
                                        <Button variant="dark" onClick={follow}>Seguir</Button>
                                    )}
                                    
                                    {/* 💬 Botón de mensaje */}
                                    <Button variant="primary" onClick={handleSendMessage}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-chat-dots me-2"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                            <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2"/>
                                        </svg>
                                        Enviar mensaje
                                    </Button>
                                </div>

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
