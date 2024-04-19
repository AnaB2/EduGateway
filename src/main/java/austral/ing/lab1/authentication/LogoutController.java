package austral.ing.lab1.authentication;

import spark.Request;
import spark.Response;
import spark.Route;

public class LogoutController {

    // Método que maneja la solicitud de logout
    public static Route handleLogout = (Request request, Response response) -> {
        // Obtener el token del encabezado Authorization
        String authorizationHeader = request.headers("Authorization");

        // Verificar si el encabezado Authorization está presente
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Extraer el token de autenticación del encabezado
            String token = authorizationHeader.substring(7);

            // Invalidar el token llamando al método blacklistToken del TokenManager
            austral.ing.lab1.authentication.TokenManager.blacklistToken(token);

            // Respuesta de éxito
            response.status(200);
            return "{\"message\": \"User logged out successfully\"}";
        } else {
            // Si el encabezado Authorization no está presente o es incorrecto
            response.status(401);
            return "{\"error\": \"Unauthorized\"}";
        }
    };
}


