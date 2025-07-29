import { useEffect, useState } from "react";
import { getEmail } from "../../services/storage";
import { db } from "../../services/firebaseConfig";
import { ref, push, onChildAdded } from "firebase/database";

export default function Chat({ chatId, nombre }) {
    const [mensajes, setMensajes] = useState([]);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const mensajesRef = ref(db, `chats/${chatId}/mensajes`);

        // Escuchar nuevos mensajes en tiempo real
        onChildAdded(mensajesRef, (data) => {
            setMensajes((prev) => [...prev, data.val()]);
        });
    }, [chatId]);

    const enviarMensaje = () => {
        const mensajesRef = ref(db, `chats/${chatId}/mensajes`);

        push(mensajesRef, {
            mensaje,
            emisor: getEmail(),
            timestamp: Date.now()
        });

        setMensaje("");
    };

    return (
        <div className="chat">
            <h1 style={{ paddingLeft: "10px" }}>{nombre}</h1>

            <div className="mensajes">
                {mensajes.map((m, index) => (
                    <div
                        key={index}
                        className={
                            getEmail() === m.emisor
                                ? "mensaje mensaje-emisor"
                                : "mensaje mensaje-receptor"
                        }
                    >
                        {m.mensaje}
                    </div>
                ))}
            </div>

            <div className="enviarMensaje">
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                />
                <button onClick={enviarMensaje}>Enviar</button>
            </div>
        </div>
    );
}
