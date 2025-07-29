import {useEffect, useState} from "react";
import axios from 'axios';
import {getId, getUserType} from "../../services/storage";
import {createChat, getListChats} from "../../services/Api";

export default function ListaDeChats({cambiarChatActual}) {

    var [chats, setChats] = useState([])
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    const buscarListaDeChats = async () => {
        try {
            setLoading(true);
            const response = await getListChats(getId(), getUserType());
            console.log(response)
            setChats(response);
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de chats:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Aquí deberías reemplazar el contenido estático por una llamada a tu API para obtener las personas con las que se ha chateado reales
        buscarListaDeChats().then((chats)=>{
            setChats(chats)

        })
    }, []);

    const crearNuevoChat = async (emailDestino) => {
        if (!emailDestino.trim()) return;
        
        try {
            setCreating(true);
            const userId = getId();
            const response = await createChat(emailDestino, userId);
            console.log(response)

            // Va a buscar lista de chats actual y actualiza
            buscarListaDeChats().then((chats)=>{
                setChats(chats)
            })
            
            // Limpiar el input
            setEmail("");
            
        } catch (error) {
            console.error("Error al crear nuevo chat:", error);
            alert("Error al crear el chat. Verifica que el email sea correcto.");
        } finally {
            setCreating(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            crearNuevoChat(email);
        }
    };

    return (
        <div className="lista-de-chats">
            <h1>Chats</h1>
            
            <div className="NuevoChat">
                <p>Nuevo chat</p>
                <input
                    type="email"
                    placeholder="Ingresa email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={creating}
                />
                <button 
                    onClick={() => crearNuevoChat(email)}
                    disabled={creating || !email.trim()}
                >
                    {creating ? "Creando..." : "Crear"}
                </button>
            </div>
            
            <div className="chatsNames">
                {loading ? (
                    <div style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>
                        Cargando chats...
                    </div>
                ) : chats.length === 0 ? (
                    <div style={{ 
                        padding: '20px', 
                        textAlign: 'center', 
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>
                        {getUserType() === "institution" 
                            ? "No tienes conversaciones aún. Los participantes pueden contactarte desde tu perfil."
                            : "No tienes chats. Crea uno nuevo ingresando el email de una institución."
                        }
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div 
                            onClick={() => cambiarChatActual(chat)} 
                            key={chat.idChat} 
                            className="chatName"
                            title={`Chat con ${(getUserType() == "institution") ? chat.userName : chat.institutionName}`}
                        >
                            {(getUserType() == "institution") ? chat.userName : chat.institutionName}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}