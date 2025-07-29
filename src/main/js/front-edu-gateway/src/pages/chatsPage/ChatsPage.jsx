import './ChatsPage.css'
import {getName, getUserType} from "../../services/storage";
import {NavbarInstitucion} from "../../components/navbar/NavbarInstitucion";
import {NavbarParticipante} from "../../components/navbar/NavbarParticipante";
import ListaDeChats from "../../components/chat/ListaDeChats";
import Chat from "../../components/chat/Chat";
import {useState} from "react";

export default function ChatsPage(){

    const [chatActual, setChatActual] = useState(null);

    const buscarMensajesAnteriores = (idChat)=>{
        // aca tiene que buscar los mensajes anteriores a la bd con el idChat recibido y retornarlos
        return [{mensaje: "Hola", emisor: "juan@gmail.com"}, {mensaje: "Hola", emisor: "fla@gmail.com"}]
    };

    const cambiarChatActual = (chat) => {
        const emisor = (getUserType() === "institution") ? chat.userName : chat.institutionName;
        setChatActual({
            id: chat.idChat,
            emisor: emisor
        });
    };

    return(
        <div>
            {getUserType()=="institution"? <NavbarInstitucion/> : <NavbarParticipante/>}
            <div className="chats-page">
                <ListaDeChats cambiarChatActual={cambiarChatActual}></ListaDeChats>
                {chatActual && <Chat chatId={chatActual.id} nombre={chatActual.emisor} />}
            </div>
        </div>
    )
}