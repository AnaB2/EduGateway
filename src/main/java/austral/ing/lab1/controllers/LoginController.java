package austral.ing.lab1.controllers;

import austral.ing.lab1.TokenManager;
import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Users;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
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
    private static final EntityManagerFactory entityManagerFactory =
        Persistence.createEntityManagerFactory("test");

    public static Route handleLogin = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        String email = formData.get("email");
        String password = formData.get("password");

        EntityManager entityManager = null;
        try {
            entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            Optional<User> userOptional = users.findByEmail(email);

            Institutions institutions = new Institutions(entityManager);
            Optional<Institution> institutionOptional = institutions.findByEmail(email);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.getPassword().equals(password)) {
                    String token = TokenManager.generateToken(email, "participant");

                   // Crear un objeto JSON con el token, el tipo de usuario y el correo electrónico
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("token", token);
                    jsonResponse.addProperty("userType", "participant"); // Opción para el tipo de usuario
                    jsonResponse.addProperty("email", email); // Correo electrónico del usuario
                    jsonResponse.addProperty("name", user.getFirstName() + " " + user.getLastName());
                   // Establecer el encabezado Content-Type
                    response.type("application/json");

                    // Establecer el encabezado Authorization con el token en el formato Bearer
                    response.header("Authorization", "Bearer " + token);

                  // Devolver el objeto JSON como cuerpo de la respuesta
                    return jsonResponse.toString();
                }
            }

            if (institutionOptional.isPresent()) {
                Institution institution = institutionOptional.get();
                if (institution.getPassword().equals(password)) {
                    String token = TokenManager.generateToken(email, "institution");
                    // Crear un objeto JSON con el token, el tipo de usuario y el correo electrónico
                    JsonObject jsonResponse = new JsonObject();
                    jsonResponse.addProperty("token", token);
                    jsonResponse.addProperty("userType", "institution"); // Opción para el tipo de usuario
                    jsonResponse.addProperty("email", email); // Correo electrónico de la institucion
                    jsonResponse.addProperty("name", institution.getInstitutionalName());

                    // Establecer el encabezado Content-Type
                    response.type("application/json");

                    // Establecer el encabezado Authorization con el token en el formato Bearer
                    response.header("Authorization", "Bearer " + token);

                    // Devolver el objeto JSON como cuerpo de la respuesta
                    return jsonResponse.toString();
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