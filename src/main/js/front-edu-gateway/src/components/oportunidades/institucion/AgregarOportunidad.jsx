import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { addOpportunity } from "../../../services/Api";

const allTags = ["Programación", "Matemáticas", "Ciencia", "Literatura", "Idiomas", "Arte", "Música", "Negocios", "Salud", "Deportes", "Tecnología", "Universidad"];  // ✅ Lista de tags predeterminados

export function AgregarOportunidad({ actualizarOportunidades }) {

    const [addSuccess, setAddSuccess] = useState(false);
    const [addError, setAddError] = useState('');

    const [visible, setVisible] = useState(false);
    const abrir = () => setVisible(true);
    const cerrar = () => {
        setVisible(false);
        setAddError('');
        setAddSuccess(false);
    }

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [language, setLanguage] = useState('');
    const [educationalLevel, setEducationalLevel] = useState('');
    const [modality, setModality] = useState('');
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');
    const [capacity, setCapacity] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);  // ✅ Estado para los tags seleccionados

    const handleTagSelection = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));  // ✅ Quitar tag si ya está seleccionado
        } else {
            setSelectedTags([...selectedTags, tag]);  // ✅ Agregar tag si no está seleccionado
        }
    };

    async function enviarForm() {
        try {
            const opportunityData = {
                name: name,
                language: language,
                educationalLevel: educationalLevel,
                modality: modality,
                city: city,
                category: category,
                capacity: capacity,
                tags: selectedTags  // ✅ Enviar los tags al backend
            }
            await addOpportunity(opportunityData);
            setAddSuccess(true);
            setAddError('');
            actualizarOportunidades();
        } catch (error) {
            console.error("Error al añadir oportunidad: ", error);
            setAddSuccess(false);
            setAddError("Error al agregar oportunidad");
        }
    }

    return (
        <>
            <Button variant="dark" onClick={abrir}>Agregar oportunidad</Button>

            <Modal show={visible} onHide={cerrar} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir oportunidad</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Select className="form-select mb-3" aria-label="Categoría" onChange={(event) => setCategory(event.target.value)}>
                        <option>Categoría</option>
                        <option value="Voluntariado">Voluntariado</option>
                        <option value="Curso">Curso</option>
                        <option value="Programa">Programa</option>
                        <option value="Evento">Evento</option>
                    </Form.Select>

                    <div className="form-oportunidad">
                        <FloatingLabel controlId="floatingName" label="Nombre" className="mb-3">
                            <Form.Control type="text" placeholder="Nombre de la oportunidad" onChange={(event) => { setName(event.target.value) }} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingLanguage" label="Idioma" className="mb-3">
                            <Form.Control type="text" placeholder="Idioma de la oportunidad" onChange={(event) => { setLanguage(event.target.value) }} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingEducationalLevel" label="Nivel educativo" className="mb-3">
                            <Form.Control type="text" placeholder="Nivel educativo requerido" onChange={(event) => { setEducationalLevel(event.target.value) }} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingModality" label="Modalidad" className="mb-3">
                            <Form.Control type="text" placeholder="Modalidad" onChange={(event) => { setModality(event.target.value) }} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingCity" label="Ciudad" className="mb-3">
                            <Form.Control type="text" placeholder="Ciudad" onChange={(event) => { setCity(event.target.value) }} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingCapacity" label="Capacidad" className="mb-3">
                            <Form.Control type="number" placeholder="Capacidad" min="0" onChange={(event) => { setCapacity(parseInt(event.target.value)) }} />
                        </FloatingLabel>
                    </div>

                    {/* Selección de Tags */}
                    <h5>Seleccionar etiquetas</h5>
                    <Form>
                        {allTags.map(tag => (
                            <Form.Check
                                key={tag}
                                type="checkbox"
                                label={tag}
                                checked={selectedTags.includes(tag)}
                                onChange={() => handleTagSelection(tag)}
                            />
                        ))}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {addError !== '' && <p style={{ color: 'red', marginTop: 10 }}>{addError}</p>}
                    {addSuccess && <p style={{ marginTop: 10 }}>Oportunidad agregada con éxito.</p>}
                    <Button variant="success" onClick={enviarForm}>Confirmar</Button>
                    <Button variant="dark" onClick={cerrar}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
