package austral.ing.lab1.controllers;

import austral.ing.lab1.model.*;
import austral.ing.lab1.repository.Inscriptions;
import austral.ing.lab1.repository.Institutions;
import austral.ing.lab1.repository.Opportunities;
import austral.ing.lab1.repository.Users;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
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

        if (formData.get("userId").trim().isEmpty() ||
                formData.get("institutionId").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        Long userId = Long.parseLong(formData.get("userId"));
        Long institutionId = Long.parseLong(formData.get("institutionId"));

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users users = new Users(entityManager);
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            // Buscar al usuario por su ID
            User user = users.findById(userId).orElse(null);
            if (user == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            // Buscar a la institución por su ID
            Institution institution = institutions.findById(institutionId).orElse(null);
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

    public static Route handleUnfollowInstitution = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {
        }.getType());

        if (formData.get("userId").trim().isEmpty() ||
                formData.get("institutionId").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        Long userId = Long.parseLong(formData.get("userId"));
        Long institutionId = Long.parseLong(formData.get("institutionId"));

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users users = new Users(entityManager);
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            // Buscar al usuario por su ID
            User user = users.findById(userId).orElse(null);
            if (user == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            // Buscar a la institución por su ID
            Institution institution = institutions.findById(institutionId).orElse(null);
            if (institution == null) {
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            // Verificar si el usuario está siguiendo a la institución
            if (!user.getFollowedInstitutions().contains(institution)) {
                response.status(400);
                return "{\"error\": \"User is not following the institution\"}";
            }

            // Eliminar la institución de la lista de instituciones seguidas por el usuario
            user.unfollowInstitution(institution);
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

    public static Route handleGetFollowersByInstitution = (Request request, Response response) -> {
        String institutionIdParam = request.params(":institutionId");
        if (institutionIdParam == null || institutionIdParam.trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing institution ID\"}";
        }

        Long institutionId = Long.parseLong(institutionIdParam);

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            // Buscar a la institución por su ID
            Institution institution = institutions.findById(institutionId).orElse(null);
            if (institution == null) {
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            // Obtener los seguidores de la institución
            Set<User> followers = institution.getFollowers();

            // Eliminar las instituciones seguidas por cada seguidor
            followers.forEach(follower -> follower.getFollowedInstitutions().clear());

            // Convertir los seguidores a DTOs
            Set<UserDTO> followerDTOs = followers.stream()
                    .map(UserDTO::new)
                    .collect(Collectors.toSet());



            tx.commit();
            response.type("application/json");
            return gson.toJson(followerDTOs);
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while fetching the followers\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetFollowedInstitutionsByUser = (Request request, Response response) -> {
        String userIdParam = request.params(":userId");
        if (userIdParam == null || userIdParam.trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing user ID\"}";
        }

        Long userId = Long.parseLong(userIdParam);

        // Get pagination parameters
        int page = Integer.parseInt(request.queryParams("page") != null ? request.queryParams("page") : "1");
        int size = Integer.parseInt(request.queryParams("size") != null ? request.queryParams("size") : "10");

        if (page < 1 || size < 1) {
            response.status(400);
            return "{\"error\": \"Invalid pagination parameters\"}";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users users = new Users(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            // Fetch user
            User user = users.findById(userId).orElse(null);
            if (user == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            // Get followed institutions
            Opportunities opportunities = new Opportunities(entityManager);
            Set<Institution> followedInstitutions = user.getFollowedInstitutions();

            // Get opportunities from followed institutions
            List<Opportunity> allOpportunities = new ArrayList<>();
            for (Opportunity opportunity : opportunities.listAll()) {
                for (Institution institution : followedInstitutions) {
                    if (opportunity.getInstitutionEmail().equals(institution.getEmail())) {
                        allOpportunities.add(opportunity);
                    }
                }
            }

            // Apply pagination
            int fromIndex = (page - 1) * size;
            int toIndex = Math.min(fromIndex + size, allOpportunities.size());
            List<Opportunity> paginatedOpportunities = allOpportunities.subList(fromIndex, toIndex);

            tx.commit();
            response.type("application/json");
            return gson.toJson(paginatedOpportunities);
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while fetching the followed institutions\"}";
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

            users.forEach(user -> {
                Set<Institution> followedInstitutions = user.getFollowedInstitutions();
                followedInstitutions.forEach(institution -> institution.setFollowers(new HashSet<>()));
            });

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

    public static Route handleDeleteUser = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users users = new Users(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        Gson gson = new Gson();

        try {
            tx.begin();

            JsonObject jsonObject = gson.fromJson(request.body(), JsonObject.class);
            String email = jsonObject.get("email").getAsString();

            if (email == null || email.isEmpty()) {
                response.status(400);
                return gson.toJson(Map.of("error", "Email parameter is missing"));
            }

            User user = users.findByEmail(email).orElse(null);

            if (user == null) {
                response.status(404);
                return gson.toJson(Map.of("error", "User not found"));
            }

            users.delete(user);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return gson.toJson(Map.of("error", "An error occurred while deleting the user"));
        } finally {
            entityManager.close();
        }
    };

    public static Route handleEditProfilePicture = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        String email = formData.get("email");

        if (formData.get("picture").trim().isEmpty()){
            response.status(400);
            return "{\"error\": \"No se encontró url de imagen\"}";
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

            user.setProfilePicture(formData.get("picture"));
            users.persist(user);
            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Profile picture updated successfully"));
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

    public static Route handleGetUserHistory = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String userEmail = request.queryParams("email");
            if (userEmail == null || userEmail.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Email parameter is missing\"}";
            }

            List<Object[]> results = entityManager.createQuery(
                            "SELECT i.opportunity, i.localidad, i.mensaje, i.estado, o.name " +
                                    "FROM Inscription i JOIN Opportunity o ON i.opportunity = o.id " +
                                    "WHERE i.emailParticipante = :userEmail", Object[].class)
                    .setParameter("userEmail", userEmail)
                    .getResultList();

            List<Map<String, Object>> inscriptions = results.stream()
                    .map(result -> Map.of(
                            "opportunity_id", result[0],
                            "localidad", result[1],
                            "mensaje", result[2],
                            "estado", result[3],
                            "opportunity_name", result[4]
                    ))
                    .collect(Collectors.toList());

            String jsonInscriptions = gson.toJson(inscriptions);

            response.type("application/json");
            return jsonInscriptions;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching user history\"}";
        } finally {
            entityManager.close();
        }
    };


}
