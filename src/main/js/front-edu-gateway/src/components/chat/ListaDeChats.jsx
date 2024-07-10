import {useEffect, useState} from "react";

export default function ListaDeChats({cambiarChatActual}) {

    var [chats, setChats] = useState([])
    const [email, setEmail] = useState("");

    const buscarListaDeChats = () => {
        // aca deberia buscar la lista de nombres de las personas con las que se ha chateado y retornarla
        return [{ nombre: "Juan", email:"juan@gmail.com", idChat: 1 }, { nombre: "Pedro", email:"pedro@gmail.com", idChat: 2 }]
    }

    useEffect(() => {
        // Aquí deberías reemplazar el contenido estático por una llamada a tu API para obtener las personas con las que se ha chateado reales
        setChats(buscarListaDeChats());
    }, []);

    const crearNuevoChat = (emailDestino) => {
        // aca tiene que crear un nuevo chat y guardarlo en la lista de chats, chequeando si existe el mail de destino
        // hacer las verificaciones si el email es valido o si el chat con esa persona ya existe

        // luego, actualizar los chats
        setChats(buscarListaDeChats());
    }

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
                <button onClick={()=>crearNuevoChat(email)}>Crear</button>
            </div>
            <div className="chatsNames">
                {chats.length !== 0 && chats.map((chat) => (
                    <div onClick={() => cambiarChatActual(chat.idChat, chat.nombre)} key={chat.idChat} className="chatName">
                        {chat.nombre}
                    </div>
                ))}
            </div>
        </div>
    )
}