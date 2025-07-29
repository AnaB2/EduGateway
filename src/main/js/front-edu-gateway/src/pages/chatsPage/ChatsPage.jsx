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

    return(
        <div>
            {getUserType()=="institution"? <NavbarInstitucion/> : <NavbarParticipante/>}
            <div className="chats-page">
                <ListaDeChats 
                    cambiarChatActual={cambiarChatActual}
                    selectedChatId={selectedChatId}
                />
                {chatActual && (
                    <Chat 
                        nombre={chatActual.emisor} 
                        mensajesAnteriores={chatActual.mensajes}
                        chatId={chatActual.id}
                        userId={chatActual.userId}
                        institutionId={chatActual.institutionId}
                    />
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