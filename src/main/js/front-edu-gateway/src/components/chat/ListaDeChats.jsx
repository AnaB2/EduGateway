import {useEffect, useState} from "react";
import axios from 'axios';
import {getId, getUserType} from "../../services/storage";
import {createChat, getListChats} from "../../services/Api";

export default function ListaDeChats({cambiarChatActual}) {

    var [chats, setChats] = useState([])
    const [email, setEmail] = useState("");

    const buscarListaDeChats = async () => {
        try {
            const response = await getListChats(getId(), getUserType());
            console.log(response)
            setChats(response);
            return response;
        } catch (error) {
            console.error("Error al obtener la lista de chats:", error);
            return [];
        }
    };

    useEffect(() => {
        // Aquí deberías reemplazar el contenido estático por una llamada a tu API para obtener las personas con las que se ha chateado reales
        buscarListaDeChats().then((chats)=>{
            setChats(chats)

        })
    }, []);

    const crearNuevoChat = async (emailDestino) => {
        try {
            const userId = getId();
            const response = await createChat(emailDestino, userId);
            //setChats((prevChats) => [...prevChats, newChat]);
            console.log(response)

            // Va a buscar lista de chats actual y actualiza
            buscarListaDeChats().then((chats)=>{
                setChats(chats)

            })        } catch (error) {
            console.error("Error al crear nuevo chat:", error);
        }
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
                <button onClick={()=>crearNuevoChat(email)}>Crear</button>
            </div>
            <div className="chatsNames">
                {chats.length !== 0 && chats.map((chat) => (
                    <div onClick={() => cambiarChatActual(chat)} key={chat.idChat} className="chatName">
                        {(getUserType() == "institution") ? chat.userName : chat.institutionName}
                    </div>
                ))}
            </div>
        </div>
    )
}