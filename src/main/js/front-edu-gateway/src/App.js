// Componente principal de la app, contiene estructura básica de app, rutas, componentes principales y lógica de estado global.
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Componentes
import {Inicio} from './pages/Inicio/Inicio.jsx'
import {InicioParticipante} from "./pages/Inicio/participante/InicioParticipante";
import {InicioInstitucion} from "./pages/Inicio/institucion/InicioInstitucion";
import {GestionarOportunidades} from "./pages/Inicio/institucion/GestionarOportunidades";
import {VerOportunidades} from "./pages/Inicio/participante/VerOportunidades";
import {PerfilParticipante} from "./pages/Inicio/participante/PerfilParticipante";
import {PerfilInstitucion} from "./pages/Inicio/institucion/PerfilInstitucion";

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Inicio/>}></Route>
            <Route path="/inicio-participante" element={<InicioParticipante/>}></Route>
            <Route path="/inicio-institucion" element={<InicioInstitucion/>}></Route>
            <Route path="/inicio-institucion/gestionar-oportunidades" element={<GestionarOportunidades/>}></Route>
            <Route path="/inicio-participante/ver-oportunidades" element={<VerOportunidades/>}></Route>
            <Route path="/inicio-participante/ver-perfil" element={<PerfilParticipante/>}></Route>
            <Route path="/inicio-institucion/ver-perfil-institucion" element={<PerfilInstitucion/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}