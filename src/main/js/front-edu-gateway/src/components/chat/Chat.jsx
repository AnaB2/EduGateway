import {useEffect, useState, useCallback, useRef} from "react";
import {getEmail, getId, getUserType} from "../../services/storage";
import {sendMessage, initializeWebSocket} from "../../services/Api";

export default function Chat({nombre, mensajesAnteriores, chatId, userId, institutionId}) {
    const [mensajes, setMensajes] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const mensajesEndRef = useRef(null);

    // Scroll automático al final cuando hay nuevos mensajes
    const scrollToBottom = () => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        console.log("Chat component mounted with:", {chatId, userId, institutionId, mensajesAnteriores});
        setMensajes(mensajesAnteriores || []);
        // Scroll al final cuando se cargan mensajes
        setTimeout(scrollToBottom, 100);
    }, [mensajesAnteriores]);

    // Scroll automático cuando se agregan nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    // Configurar WebSocket para recibir mensajes en tiempo real
    useEffect(() => {
        if (!chatId) return;

        const handleWebSocketMessage = (data) => {
            console.log("WebSocket message received in Chat:", data);
            
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

            console.log("Sending message:", {
                chatId, 
                senderId: currentUserId, 
                receiverId, 
                content: mensaje,
                receiverType,
                debug: {
                    currentUserType,
                    institutionId: institutionId,
                    userId: userId
                }
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
            
            console.log("Message sent successfully");
            
        } catch (error) {
            console.error("Error sending message:", error);
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

    const formatTime = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            return '';
        }
    };

    return (
        <div className="chat">
            <h1>{nombre}</h1>

            <div className="mensajes">
                {mensajes.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px 20px', 
                        color: '#6b7280',
                        fontStyle: 'italic'
                    }}>
                        💬 No hay mensajes aún. ¡Envía el primer mensaje!
                    </div>
                ) : (
                    mensajes.map((mensaje) => {
                        const currentUserId = getId();
                        const isOwnMessage = mensaje.emisor.toString() === currentUserId.toString();
                        
                        return (
                            <div 
                                key={mensaje.idMensaje || mensaje.timestamp}
                                className={isOwnMessage ? "mensaje mensaje-emisor" : "mensaje mensaje-receptor"}
                                title={formatTime(mensaje.timestamp)}
                            >
                                {mensaje.mensaje}
                            </div>
                        );
                    })
                )}
                <div ref={mensajesEndRef} />
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
                    title={loading ? "Enviando..." : "Enviar mensaje"}
                >
                </button>
            </div>
        </div>
    );
}