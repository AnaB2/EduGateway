// Componente principal de la app, contiene estructura básica de app, rutas, componentes principales y lógica de estado global.

import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Componentes
import {Inicio} from './pages/Inicio/Inicio.jsx'

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Inicio/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}