import './ChatsPage.css'
import {getUserType} from "../../services/storage";
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

    const cambiarChatActual = (idChat) => {
        // Ir a buscar los mensajes anteriores del chat con idChat y guardarlos en chatActual
        setChatActual(buscarMensajesAnteriores(idChat));
    };

    return(
        <div>
            {getUserType()=="institution"? <NavbarInstitucion/> : <NavbarParticipante/>}
            <div className="chats-page">
                <ListaDeChats cambiarChatActual={cambiarChatActual}></ListaDeChats>
                {chatActual && <Chat mensajesAnteriores={chatActual}/>}
            </div>
        </div>
    )
}