import Dropdown from 'react-bootstrap/Dropdown';
import {inicializarConexionWebSocket} from "../../services/Api";
import {useEffect, useState} from "react";

function BasicExample() {

    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        const ws = inicializarConexionWebSocket((mensaje) => {
            setNotificaciones(prevNotificaciones => [...prevNotificaciones, mensaje]);
            console.log(mensaje);
            console.log(notificaciones);
        });

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    return (
        <Dropdown>
            <Dropdown.Toggle variant="black" style={{color: "white"}} id="dropdown-basic">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/></svg>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {notificaciones.map((n, index) => {
                    return (
                        <Dropdown.Item key={index}>{n}</Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default BasicExample;