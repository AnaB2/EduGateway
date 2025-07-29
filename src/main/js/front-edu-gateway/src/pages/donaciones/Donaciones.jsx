import {useNavigate} from "react-router";
import {getId, getToken, getUserType} from "../../services/storage";
import {mostrarAlertaAutenticacion} from "../../components/AlertaAutenticacion";
import {NavbarInstitucion} from "../../components/navbar/NavbarInstitucion";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import {useEffect, useState} from "react";
import {getReceivedDonations, getSentDonations} from "../../services/Api";

export default function Donaciones(){

    const navigate = useNavigate()
    const isInstitution = getUserType()==="institution";
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                if (isInstitution) {
                    const data = await getReceivedDonations(getId());
                    setDonations(data);
                } else {
                    const data = await getSentDonations(getId());
                    setDonations(data);
                }
            } catch (error) {
                console.error("Error al obtener donaciones:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, [isInstitution]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    if (!getToken()) {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    return(
        <div>
            {isInstitution ? <NavbarInstitucion/> : <NavbarParticipante/>}
            <div className="donaciones">
                <h1>{isInstitution ? "Donaciones recibidas" : "Donaciones enviadas"}</h1>
                
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando donaciones...</span>
                        </div>
                        <div className="loading-text">Cargando tus donaciones...</div>
                    </div>
                ) : donations.length > 0 ? (
                    <div className="contenedor_donaciones">
                        {donations.map((donation) => (
                            <div className="donacion" key={donation.id}>
                                <h2>#{donation.id}</h2>
                                <p><strong>De:</strong> {donation.userName}</p>
                                <p><strong>Para:</strong> {donation.institutionName}</p>
                                <p><strong>Monto:</strong> ${donation.amount}</p>
                                <p><strong>Fecha:</strong> {formatDate(donation.donationDate)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="donaciones-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                            <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/>
                        </svg>
                        <h3>No hay donaciones registradas</h3>
                        <p>
                            {isInstitution 
                                ? "Aún no has recibido donaciones. Asegúrate de que tu perfil esté completo para que los usuarios puedan encontrarte y apoyar tu causa."
                                : "No has realizado donaciones aún. Explora las instituciones y contribuye con las causas que más te interesen."
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}