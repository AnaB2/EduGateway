// Componente principal de la app, contiene estructura básica de app, rutas, componentes principales y lógica de estado global.
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Componentes
import {Inicio} from './pages/Inicio/Inicio.jsx'
import {InicioParticipante} from "./pages/Inicio/InicioParticipante";
import {InicioInstitucion} from "./pages/Inicio/InicioInstitucion";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Inicio/>}></Route>
            <Route path="/inicio-participante" element={<InicioParticipante/>}></Route>
            <Route path="/inicio-institucion" element={<InicioInstitucion/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}