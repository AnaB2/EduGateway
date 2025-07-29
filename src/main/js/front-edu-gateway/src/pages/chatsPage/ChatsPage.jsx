import './ChatsPage.css'
import {getName, getUserType, getId} from "../../services/storage";
import {NavbarInstitucion} from "../../components/navbar/NavbarInstitucion";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import ListaDeChats from "../../components/chat/ListaDeChats";
import Chat from "../../components/chat/Chat";
import {useState, useEffect} from "react";
import {useLocation} from "react-router";
import {getChatMessages} from "../../services/Api";

export default function ChatsPage(){
    const location = useLocation();
    const [chatActual, setChatActual] = useState(null);
    
    // 💬 Obtener información del chat seleccionado desde la navegación
    const selectedChatId = location.state?.selectedChatId;
    const institutionName = location.state?.institutionName;

    useEffect(() => {
        // Si llegamos desde el perfil de institución con un chat específico
        if (selectedChatId && institutionName) {
            console.log("💬 Auto-selecting chat:", selectedChatId, "with", institutionName);
            
            // Simular la selección del chat
            const autoSelectedChat = {
                id: selectedChatId,
                institutionName: institutionName,
                userName: "Usuario" // Esto se puede mejorar obteniendo el nombre real
            };
            
            cambiarChatActual(autoSelectedChat);
        }
    }, [selectedChatId, institutionName]);

    const buscarMensajesAnteriores = async (idChat) => {
        try {
            console.log("🔍 Buscando mensajes anteriores para chat:", idChat);
            const messages = await getChatMessages(idChat);
            console.log("📨 Mensajes obtenidos:", messages);
            
            // Convertir al formato esperado por el componente Chat y ordenar por timestamp
            const formattedMessages = messages.map(message => ({
                idMensaje: message.id,
                mensaje: message.content,
                emisor: message.sender, // Esto será el ID, podríamos mejorarlo para mostrar el email
                timestamp: message.timestamp
            }));
            
            // Ordenar por timestamp (más antiguos primero) como medida de seguridad
            return formattedMessages.sort((a, b) => a.timestamp - b.timestamp);
        } catch (error) {
            console.error("Error al obtener mensajes:", error);
            return []; // Retornar array vacío en caso de error
        }
    };

    const cambiarChatActual = async (chat) => {
        console.log("💬 Cambiando chat actual:", chat);
        
        // Ir a buscar los mensajes anteriores del chat con idChat y guardarlos en chatActual
        const mensajesAnteriores = await buscarMensajesAnteriores(chat.id || chat.idChat);
        const emisor = (getUserType()=="institution")? chat.userName : chat.institutionName;
        
        setChatActual({
            id: chat.id || chat.idChat,
            emisor: emisor, 
            mensajes: mensajesAnteriores,
            institutionName: chat.institutionName,
            userName: chat.userName,
            // Usar los IDs reales del chat, no solo el usuario actual
            userId: chat.userId,
            institutionId: chat.institutionId
        });
    };

    const EmptyState = () => (
        <div className="chat-empty">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287-1.864l.13-.03a1 1 0 0 1 1.358.83l.249 1.245a1 1 0 0 1-1.359.83l-.13-.03a1 1 0 0 1-.535-.837zm8.043-8.182a1 1 0 0 1 1.36-.83l.13.03a1 1 0 0 1 .835 1.363l-.246 1.245a1 1 0 0 1-1.36.83l-.13-.03a1 1 0 0 1-.835-1.363zM11.88 1.92a1 1 0 0 1 1.36-.83l.13.03c.367.094.622.448.622.834 0 .52-.301.924-.662 1.113l-.13.03a1 1 0 0 1-1.36-.83c0-.386.255-.74.622-.834zM13.5 7c.276 0 .5.224.5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
            <h3>Selecciona un chat</h3>
            <p>
                {getUserType() === "institution" 
                    ? "Elige una conversación de la lista para empezar a chatear con participantes."
                    : "Elige una conversación de la lista o crea un nuevo chat con una institución."
                }
            </p>
        </div>
    );

    return(
        <div className="chats-page-container">
            {getUserType()=="institution"? <NavbarInstitucion/> : <NavbarParticipante/>}
            <div className="chats-page">
                <ListaDeChats 
                    cambiarChatActual={cambiarChatActual}
                    selectedChatId={selectedChatId}
                />
                {chatActual ? (
                    <Chat 
                        nombre={chatActual.emisor} 
                        mensajesAnteriores={chatActual.mensajes}
                        chatId={chatActual.id}
                        userId={chatActual.userId}
                        institutionId={chatActual.institutionId}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
            
            {/* 💬 Mensaje de bienvenida si viene desde perfil */}
            {selectedChatId && institutionName && (
                <div className="alert alert-info m-3">
                    💬 Chat iniciado con <strong>{institutionName}</strong>. 
                    {chatActual ? " ¡Puedes comenzar a escribir!" : " Cargando mensajes..."}
                </div>
            )}
        </div>
    )
}