import Swal from "sweetalert2";
import {useNavigate} from "react-router";

export function mostrarAlertaAutenticacion(navigate, destino){

    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error de autenticación",
        confirmButtonText: "OK",
        showCancelButton: false, // Ocultar el botón de cancelar
    }).then((result) => {
        if (result.isConfirmed) {
            // Navegar a la dirección deseada
            navigate(destino);
        }
    });
}