// Punto de entrada JS de la app React.
// Se renderiza el componente principal (App.js) de la app en el HTML especificado (div con id="root" en index.html).
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import './styles/styles.css'; // Importa los estilos CSS


ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
)

