import Dropdown from 'react-bootstrap/Dropdown';
import { inicializarConexionWebSocket } from "../../services/Api";
import { useEffect, useState } from "react";

function BasicExample() {
    const [notificaciones, setNotificaciones] = useState([]);

    // Función para manejar el mensaje recibido
    function alRecibirMensaje(message) {
        console.log('Message received from server:', message);
        // Convert the message to a string if it's an object
        const messageStr = typeof message === 'object' ? JSON.stringify(message) : message;
        // Update the state with the string message
        setNotificaciones(prevNotificaciones => [...prevNotificaciones, messageStr]);
    }

    useEffect(() => {
        // Inicialización de la conexión WebSocket al montar el componente
        const ws = inicializarConexionWebSocket(alRecibirMensaje);

        // Limpieza al desmontar el componente
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez al montar el componente

    return (
        <Dropdown>
            <Dropdown.Toggle variant="black" style={{ color: "white" }} id="dropdown-basic">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                </svg>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {notificaciones.map((n, index) => (
                    <Dropdown.Item key={index}>{n}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default BasicExample;
