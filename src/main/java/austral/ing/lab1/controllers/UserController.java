package austral.ing.lab1.controllers;

import austral.ing.lab1.model.Institution;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Opportunities;
import austral.ing.lab1.repository.Users;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import spark.Request;
import spark.Response;
import spark.Route;

public class UserController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleFollowInstitution = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
        }.getType());

        if (formData.get("UserEmail").trim().isEmpty() || formData.get("institutionEmail").trim().isEmpty()) {
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

    public static Route handleGetFollowedInstitutions = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();

        try {
            String email = request.queryParams("email");

            // Chequear si se recibe el email como parámetro
            if (email == null || email.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Email parameter is missing\"}";
            }

            // Buscar al usuario por su correo electrónico y obtener la lista de instituciones seguidas
            List<Institution> institutions = new Users(entityManager).findByEmail(email) // Buscar al usuario por su correo electrónico
                    .map(User::getFollowedInstitutions) // Obtener la lista de instituciones seguidas
                    .map(ArrayList::new) // Convertir el Set a List
                    .orElseGet(ArrayList::new); // Si no se encuentra el usuario, devolver una lista vacía

            String jsonInstitutions = gson.toJson(institutions); // Convertir la lista de instituciones a JSON
            response.type("application/json"); // Establecer el tipo de contenido de la respuesta
            return jsonInstitutions;

        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching followed institutions by email\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleEditUser = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        String email = formData.get("previousEmail");

        if (formData.get("firstName").trim().isEmpty() ||
                formData.get("lastName").trim().isEmpty() ||
                formData.get("password").trim().isEmpty() ||
                formData.get("description").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users users = new Users(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            User user = users.findByEmail(email).orElse(null);

            if (user == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            user.setFirstName(formData.get("firstName"));
            user.setLastName(formData.get("lastName"));
            user.setPassword(formData.get("password"));
            user.setDescription(formData.get("description"));

            users.persist(user);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while updating the profile\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetUserData = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String email = request.queryParams("email");

            if (email == null || email.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Email parameter is missing\"}";
            }

            List<User> users = new Users(entityManager).findByEmail(email)
                    .map(List::of)
                    .orElseGet(ArrayList::new);

            String jsonUsers = gson.toJson(users);

            response.type("application/json");
            return jsonUsers;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching opportunities by email\"}";
        } finally {
            entityManager.close();
        }
    };

}

