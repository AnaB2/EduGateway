package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Users;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import spark.Request;
import spark.Response;
import spark.Route;

public class UserController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleFollowInstitution = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String,String>>(){}.getType());

        if(formData.get("UserEmail").trim().isEmpty() || formData.get("institutionEmail").trim().isEmpty()){
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        String userEmail = formData.get("userEmail");
        String institutionEmail = formData.get("institutionEmail");

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users users = new Users(entityManager);
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            // Buscar al usuario por su correo electrónico
            User user = users.findByEmail(userEmail).orElse(null);
            if (user == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            // Buscar a la institución por su correo electrónico
            Institution institution = institutions.findByEmail(institutionEmail).orElse(null);
            if (institution == null) {
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            // Agregar la institución a la lista de instituciones seguidas por el usuario
            user.followInstitution(institution);
            users.persist(user);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "User is now following the institution"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while following the institution\"}";
        } finally {
            entityManager.close();
        }
    };
}

