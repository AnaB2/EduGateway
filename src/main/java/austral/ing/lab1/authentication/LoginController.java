package austral.ing.lab1.authentication;

import com.google.gson.Gson;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Users;
import com.google.common.reflect.TypeToken;
import java.util.Map;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import spark.Request;
import spark.Response;
import spark.Route;


// Clase que maneja las solicitudes de inicio de sesión
public class LoginController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

//  public static Route handleEdit = (Request request, Response response) -> {
//    // Obtener el token de la cabecera de la solicitud
//    String token = request.headers("Authorization");
//    // Obtener el correo electrónico del token
//    String email = TokenManager.getUserEmail(token);
//  }

    //   Método que maneja la solicitud de inicio de sesión
    public static Route handleLogin = (Request request, Response response) -> {
        // Obtener los datos de inicio de sesión del cuerpo de la solicitud
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
        }.getType());

        String email = formData.get("email");
        String password = formData.get("password");

        // Validar los datos de inicio de sesión
        EntityManager entityManager = null;
        try {
            entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            Optional<User> userOptional = users.findByEmail(email);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.getPassword().equals(password)) {
                    // Si las credenciales son válidas, generar y enviar el token JWT
                    String token = austral.ing.lab1.authentication.TokenManager.generateToken(email);
                    response.header("Authorization", "Bearer " + token);
                    response.type("application/json");
                    // Devolver el token y el mensaje de éxito en formato JSON
                    return gson.toJson(Map.of("token", token, "message", "User logged in successfully"));

                }
            }
            response.status(401);
            return "{\"error\": \"Invalid email or password\"}";
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    };
}
