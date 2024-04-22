import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {FormularioRegistroParticipante} from "./FormularioRegistroParticipante";
import {FormularioRegistroInstitucion} from "./FormularioRegistroInstitucion";
import Button from "react-bootstrap/Button";

export function Registro(){

    const[visible, setVisible] = useState(false)
    const[formVisible, setFormVisible] = useState(<></>)
    const[botonActivo, setBotonActivo] = useState('')

    const cerrar = () => {
        setVisible(false)
        setFormVisible(<></>)
        setBotonActivo('')
    }
    const abrir = () => setVisible(true)

    const verFormDeUsuario = (form, usuario) => {
        setFormVisible(form)
        setBotonActivo(usuario)
    }


    return(
        <>
            <Button variant="dark" onClick={abrir}>Registrarse</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Registrarse`}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="body-modal-registro">
                    <div className="opciones-de-registro">
                        <Button variant={botonActivo === 'participante' ? 'primary' : 'dark'} onClick={()=>verFormDeUsuario(<FormularioRegistroParticipante/>, 'participante')}>Participante</Button>
                        <Button variant={botonActivo === 'institucion' ? 'primary' : 'dark'} onClick={()=>verFormDeUsuario(<FormularioRegistroInstitucion/>, 'institucion')}>Institución</Button>
                    </div>
                    <div>
                        {formVisible}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}