import { getEmail, getToken, getUserType } from "../../services/storage";
import { mostrarAlertaAutenticacion } from "../../components/AlertaAutenticacion";
import { NavbarParticipante } from "../../components/navbar/NavbarParticipante";
import { useNavigate } from "react-router";
import { EditarPerfilParticipante } from "../../components/perfiles/participante/EditarPerfilParticipante";
import { EliminarPerfilParticipante } from "../../components/perfiles/participante/EliminarPerfilParticipante";
import { useEffect, useState } from "react";
import { getUserData, getUserHistory, updateUserTags } from "../../services/Api";  // ✅ Función para actualizar los tags del usuario
import { VerHistorialParticipante } from "../../components/perfiles/participante/VerHistorialParticipante";
import { Form, Button } from "react-bootstrap";

const allTags = ["Programación", "Matemáticas", "Ciencia", "Literatura", "Idiomas", "Arte", "Música", "Negocios", "Salud", "Deportes", "Tecnología", "Universidad"];  // ✅ Lista de tags predeterminados

export function PerfilParticipante() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);  // ✅ Estado para los tags seleccionados

    useEffect(() => {
        getUserData(getEmail()).then(data => {
            setUserData(data[0]);
            setSelectedTags(data[0].preferredTags ? data[0].preferredTags.split(",") : []);  // ✅ Cargar tags del usuario
        }).catch(error => console.error(error));

        getUserHistory(getEmail()).then(data => {
            setInscriptions(data);
        }).catch(error => console.error(error));
    }, []);

    if (!getToken() || getUserType() !== "participant") {
        return (
            <>
                {mostrarAlertaAutenticacion(navigate, "/")}
            </>
        );
    }

    const handleTagSelection = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));  // ✅ Quitar tag si ya está seleccionado
        } else {
            setSelectedTags([...selectedTags, tag]);  // ✅ Agregar tag si no está seleccionado
        }
    };

    const handleSaveTags = async () => {
        try {
            await updateUserTags(getEmail(), selectedTags.join(","));  // ✅ Enviar tags al backend
            alert("Preferencias actualizadas correctamente");
        } catch (error) {
            console.error("Error updating tags:", error);
        }
    };

    return (
        <>
            <NavbarParticipante />

            <div className="contenido-pagina-perfil">
                {userData ? (
                    <div className={"datos-perfil"}>
                        <h1>Perfil</h1>
                        <div>
                            <p>Nombre:</p>
                            <p>{userData.firstName}</p>
                        </div>
                        <div>
                            <p>Apellido:</p>
                            <p>{userData.lastName}</p>
                        </div>
                        <div>
                            <p>Correo:</p>
                            <p>{userData.email}</p>
                        </div>
                        <div>
                            <p>Descripción:</p>
                            <p>{userData.description}</p>
                        </div>

                        {/* Selección de Tags */}
                        <h3>Preferencias</h3>
                        <Form>
                            {allTags.map(tag => (
                                <Form.Check
                                    key={tag}
                                    type="checkbox"
                                    label={tag}
                                    checked={selectedTags.includes(tag)}
                                    onChange={() => handleTagSelection(tag)}
                                />
                            ))}
                        </Form>
                        <Button variant="success" onClick={handleSaveTags} style={{ marginTop: "10px" }}>
                            Guardar preferencias
                        </Button>

                        <EditarPerfilParticipante
                            actualizarParticipante={() => {
                                getUserData(getEmail()).then(data => {
                                    setUserData(data[0]);
                                }).catch(error => console.error(error));
                            }}
                            datosAnteriores={userData}
                        />
                        <VerHistorialParticipante inscriptions={inscriptions} />
                    </div>
                ) : (
                    <p>Cargando datos del perfil...</p>
                )}

                {userData && (
                    <>
                        <EliminarPerfilParticipante
                            actualizarParticipante={() => {
                                navigate("/");
                            }}
                            email={userData.email}
                        />
                    </>
                )}
            </div>
        </>
    );
}
