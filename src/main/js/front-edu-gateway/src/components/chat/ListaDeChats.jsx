import { useEffect, useState } from "react";
import { getId, getUserType, getEmail } from "../../services/storage";
import { db } from "../../services/firebaseConfig";
import { ref, onValue, set, push } from "firebase/database";
import { emailExists } from "../../services/Api";

export default function ListaDeChats({ cambiarChatActual }) {
    const [chats, setChats] = useState([]);
    const [email, setEmail] = useState("");

    const formatUserKey = (email, tipo) => `${tipo}_${email.replace(/\./g, "_")}`;

    const userId = formatUserKey(getEmail(), getUserType());
    const emailFormateado = getEmail().replace(".", "_");

    // Recrea el nodo del usuario si fue eliminado
    useEffect(() => {
        set(ref(db, `usuarios/${emailFormateado}`), {
            tipo: getUserType()
        });
    }, []);

    // Escucha los chats en tiempo real
    useEffect(() => {
        const chatsRef = ref(db, `chatList/${userId}`);
        const unsubscribe = onValue(chatsRef, (snapshot) => {
            const data = snapshot.val();
            const lista = data ? Object.values(data) : [];
            setChats(lista);
        });
        return () => unsubscribe();
    }, [userId]);

    // Guarda referencia al usuario logueado (para uso cruzado)
    useEffect(() => {
        const userPath = `usuarios/${emailFormateado}`;
        set(ref(db, userPath), {
            id: getId(),
            tipo: getUserType()
        });
    }, []);

    // Crear nuevo chat, validando existencia del email destino
    const crearNuevoChat = async (emailDestino) => {
        if (!emailDestino.includes("@")) {
            alert("Email inválido.");
            return;
        }

        const tipo = getUserType();
        const otroTipo = tipo === "participant" ? "institution" : "participant";

        try {
            const existe = await emailExists(emailDestino, otroTipo);
            if (!existe) {
                alert("El destinatario no existe.");
                return;
            }
        } catch (e) {
            console.error("Error al verificar email:", e);
            alert("Error al verificar el destinatario.");
            return;
        }

        // Buscar ID real del destinatario en Firebase
        const emailFormateadoDestino = emailDestino.replace(".", "_");
        const usuarioRef = ref(db, `usuarios/${emailFormateadoDestino}`);
        let idDestino = null;

        const snapshot = await new Promise((resolve) => onValue(usuarioRef, resolve, { onlyOnce: true }));
        const usuarioDestino = snapshot.val();

        if (!usuarioDestino || !usuarioDestino.id) {
            alert("No se encontró el ID del destinatario. Asegurate que haya iniciado sesión al menos una vez.");
            return;
        }

        idDestino = formatUserKey(emailDestino, usuarioDestino.tipo);

        // Crear ID único del chat
        const nuevoId = push(ref(db, "chats")).key;

        const nuevoChatInfo = {
            chatId: nuevoId,
            nombre: emailDestino,
            tipo: usuarioDestino.tipo
        };

        // Guardar en ambos usuarios
        await set(ref(db, `chatList/${userId}/${nuevoId}`), nuevoChatInfo);
        await set(ref(db, `chatList/${idDestino}/${nuevoId}`), {
            chatId: nuevoId,
            nombre: getEmail(),
            tipo: tipo
        });

        setEmail(""); // limpia input
    };

    return (
        <div className="lista-de-chats">
            <h1>Chats</h1>
            <div className={"NuevoChat"}>
                <p>Nuevo chat</p>
                <input
                    type="text"
                    placeholder="Ingresa email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={() => crearNuevoChat(email)}>Crear</button>
            </div>
            <div className="chatsNames">
                {chats.map((chat) => (
                    <div
                        onClick={() =>
                            cambiarChatActual({
                                idChat: chat.chatId,
                                userName: chat.nombre,
                                institutionName: chat.nombre
                            })
                        }
                        key={chat.chatId}
                        className="chatName"
                    >
                        {chat.nombre}
                    </div>
                ))}
            </div>
        </div>
    );
}
