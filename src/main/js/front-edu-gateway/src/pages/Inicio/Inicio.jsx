import React from 'react';
import { Registro } from "../../components/componentesSignup/Registro";
import { Login } from "../../components/componentesLogin/Login";
import '../Inicio.css';

export function Inicio() {
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center"> {/* Contenedor flexible con alineación vertical y horizontal */}
                <div className="col-md-6 text-center"> {/* Columna para el logo */}
                    <img src="https://img.freepik.com/vector-premium/logotipo-educacion-libro-objeto-elemento-humano-aprendizaje-feliz-diseno-vectores-creativos_490655-85.jpg?w=200" alt="Logo de EduGateway" className="img-fluid mt-4" /> {/* Imagen o logo */}
                    <h1 className="mt-4">Bienvenido a EduGateway</h1> {/* Texto del encabezado */}
                </div>
                <div className="col-md-6"> {/* Columna para los componentes Registro y Login */}
                    <div
                        className="d-flex flex-column align-items-center"> {/* Contenedor flexible con alineación vertical */}
                        <Registro className="mb-4"/> {/* Componente Registro con margen inferior */}
                        <div className="my-2"></div>
                        <Login className="mt-4"/> {/* Componente Login con margen superior */}
                    </div>
                </div>
            </div>
        </div>
    );
}
