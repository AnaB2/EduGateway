import {useEffect, useState, useCallback} from "react";
import {getEmail, getId, getUserType} from "../../services/storage";
import {sendMessage, initializeWebSocket} from "../../services/Api";

export default function Chat({nombre, mensajesAnteriores, chatId, userId, institutionId}) {
    const [mensajes, setMensajes] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("💬 Chat component mounted with:", {chatId, userId, institutionId, mensajesAnteriores});
        setMensajes(mensajesAnteriores || []);
    }, [mensajesAnteriores]);

    // Configurar WebSocket para recibir mensajes en tiempo real
    useEffect(() => {
        if (!chatId) return;

        const handleWebSocketMessage = (data) => {
            console.log("💬 WebSocket message received in Chat:", data);
            
            // Si es un mensaje de chat, agregarlo a la lista
            if (data.includes("New message:")) {
                // Extraer información del mensaje (esto es básico, se puede mejorar)
                const content = data.replace("New message: ", "").split(" from ")[0];
                const senderId = data.split(" from ")[1];
                
                const newMessage = {
                    idMensaje: Date.now(), // ID temporal
                    mensaje: content,
                    emisor: senderId,
                    timestamp: Date.now()
                };
                
                // Agregar mensaje y mantener orden por timestamp
                setMensajes(prev => {
                    const updatedMessages = [...prev, newMessage];
                    return updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                });
            }
        };

        // Inicializar WebSocket y registrar handler
        initializeWebSocket(handleWebSocketMessage);
        
        return () => {
            // Cleanup si es necesario
        };
    }, [chatId]);

    const enviarMensaje = async () => {
        if (!mensaje.trim() || !chatId || loading) return;

        setLoading(true);
        
        try {
            const currentUserId = getId();
            const currentUserType = getUserType();
            
            // Determinar receptor y tipo
            let receiverId, receiverType;
            if (currentUserType === "participant") {
                receiverId = institutionId;
                receiverType = "institution";
            } else {
                receiverId = userId;
                receiverType = "participant";
            }

            console.log("💬 Sending message:", {
                chatId, 
                senderId: currentUserId, 
                receiverId, 
                content: mensaje,
                receiverType
            });

            // Enviar mensaje al backend
            await sendMessage(chatId, currentUserId, receiverId, mensaje, receiverType);

            // Agregar mensaje al estado local inmediatamente (optimistic update)
            const newMessage = {
                idMensaje: Date.now(),
                mensaje: mensaje,
                emisor: currentUserId,
                timestamp: Date.now()
            };
            
            // Agregar mensaje y mantener orden por timestamp
            setMensajes(prev => {
                const updatedMessages = [...prev, newMessage];
                return updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
            });
            setMensaje("");
            
            console.log("✅ Message sent successfully");
            
        } catch (error) {
            console.error("❌ Error sending message:", error);
            alert("Error al enviar mensaje. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    };

    return (
        <div className="chat">
            <h1 style={{paddingLeft: '10px'}}>{nombre}</h1>

            <div className="mensajes">
                {mensajes.map((mensaje) => {
                    const currentUserId = getId();
                    const isOwnMessage = mensaje.emisor.toString() === currentUserId.toString();
                    
                    return (
                        <div 
                            key={mensaje.idMensaje || mensaje.timestamp}
                            className={isOwnMessage ? "mensaje mensaje-emisor" : "mensaje mensaje-receptor"}
                        >
                            {mensaje.mensaje}
                        </div>
                    );
                })}
            </div>

            <div className="enviarMensaje">
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <button 
                    onClick={enviarMensaje}
                    disabled={loading || !mensaje.trim()}
                >
                    {loading ? "Enviando..." : "Enviar"}
                </button>
            </div>
        </div>
    );
}