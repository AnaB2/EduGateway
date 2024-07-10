import {useEffect, useState} from "react";
import {getEmail} from "../../services/storage";

export default function Chat({nombre, mensajesAnteriores}) {

    var [mensajes, setMensajes] = useState([])
    var [mensaje, setMensaje] = useState("")

    useEffect(() => {
        setMensajes(mensajesAnteriores)
        // mensajes anteriores se pasa desde ListaDeChats.jsx al apretar el nombre
        // mensajes anteriores es actualmente [{mensaje: "Hola", emisor: "juan@gmail.com"}, {mensaje: "Hola", emisor: "fla@gmail.com"}]
    }, []);

    return (
        <div className="chat">
            <h1 style={{paddingLeft:'10px'}}>{nombre}</h1>
            <div className="mensajes">
                {// Muestra los mensajes del estado "mensajes" en el chat. Compara el mail del emisor del mensaje con el actual para saber si es un mensaje enviado o recibido.
                    mensajes.map((mensaje) => {
                    return <div key={mensaje.idMensaje}
                                className={getEmail() === mensaje.emisor ? "mensaje mensaje-emisor" : "mensaje mensaje-receptor"}>{mensaje.mensaje}</div>
                })}
            </div>
        </div>
    )
}