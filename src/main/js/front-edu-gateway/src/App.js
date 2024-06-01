// Componente principal de la app, contiene estructura básica de app, rutas, componentes principales y lógica de estado global.
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Componentes
import {Inicio} from './pages/Inicio/Inicio.jsx'
import {InicioParticipante} from "./pages/participante/InicioParticipante";
import {InicioInstitucion} from "./pages/institucion/InicioInstitucion";
import {GestionarOportunidades} from "./pages/institucion/GestionarOportunidades";
import {VerOportunidades} from "./pages/participante/VerOportunidades";
import {PerfilParticipante} from "./pages/participante/PerfilParticipante";
import {PerfilInstitucion} from "./pages/institucion/PerfilInstitucion";
import {PerfilPublicoInstitucion} from "./pages/institucion/PerfilPublicoInstitucion";

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
            <Route path="/ver-perfil-institucion/:nombre" element={<PerfilPublicoInstitucion/>}></Route>

        </Routes>
    </BrowserRouter>
  );
}