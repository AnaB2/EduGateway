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

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                if (isInstitution) {
                    const data = await getReceivedDonations(getId());
                    setDonations(data);
                } else {
                    const data = await getSentDonations(getId());
                    setDonations(data);
                }
            } catch (error) {
                console.error("Error al obtener donaciones:", error);
            }
        };

        fetchDonations();
    }, [isInstitution]);

    if (!getToken()) {
        return mostrarAlertaAutenticacion(navigate, "/");
    }

    return(
        <div>
            {isInstitution? <NavbarInstitucion/> : <NavbarParticipante/>}
            <div className={"donaciones"}>
                {isInstitution ? <h1>Donaciones recibidas</h1> : <h1>Donaciones enviadas</h1>}
                <div className={"contenedor_donaciones"}>
                    {donations.length > 0 ? (
                        donations.map((donation) => (
                            <div className={"donacion"} key={donation.id}>
                                <h2>{`#${donation.id}`}</h2>
                                <p>{`De: ${donation.userName}`}</p>
                                <p>{`Para: ${donation.institutionName}`}</p>
                                <p>{`Monto: ${donation.amount}`}</p>
                                <p>{`Fecha: ${donation.donationDate}`}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay donaciones registradas.</p>
                    )}
                </div>
            </div>
        </div>
    )
}