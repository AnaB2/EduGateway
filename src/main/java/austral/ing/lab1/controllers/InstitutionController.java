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
import java.util.Set;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import spark.Request;
import spark.Response;
import spark.Route;

public class InstitutionController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleEditInstitution = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        String institutionalEmail = formData.get("previousEmail");

        if (formData.get("institutionalName").trim().isEmpty() ||
                formData.get("password").trim().isEmpty() ||
                formData.get("description").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();
            System.out.println("Searching for institution with email: " + institutionalEmail);
            Institution institution = institutions.findByEmail(institutionalEmail).orElse(null);

            if (institution == null) {
                response.status(404);
                return "{\"error\": \"Institution not found\"}";
            }

            System.out.println("Institution found: " + institution.getInstitutionalName());
            institution.setInstitutionalName(formData.get("institutionalName"));
            institution.setPassword(formData.get("password"));
            institution.setDescription(formData.get("description"));

            institutions.persist(institution);
            tx.commit();

            System.out.println("Institutional profile updated successfully");

            response.type("application/json");
            return gson.toJson(Map.of("message", "Institutional profile updated successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace(); // Log the exception details
            response.status(500);
            return "{\"error\": \"An error occurred while updating the institutional profile\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetInstitutionData = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String institutionalEmail = request.queryParams("email");

            if (institutionalEmail == null || institutionalEmail.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Email parameter is missing\"}";
            }

            List<Institution> institutions = new Institutions(entityManager).findByEmail(institutionalEmail)
                    .map(List::of)
                    .orElseGet(ArrayList::new);

            // Eliminar

            institutions.forEach(institution -> {
                Set<User> followedInstitutions = institution.getFollowers();
                followedInstitutions.forEach(user-> institution.setFollowers(new HashSet<>()));
            });


            String jsonInstitutions = gson.toJson(institutions);

            response.type("application/json");
            return jsonInstitutions;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching institutions by email\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleDeleteInstitution = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Institutions institutions = new Institutions(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        Gson gson = new Gson();

        try {
            tx.begin();

            JsonObject jsonObject = gson.fromJson(request.body(), JsonObject.class);
            String institutionalEmail = jsonObject.get("email").getAsString();

            if (institutionalEmail == null || institutionalEmail.isEmpty()) {
                response.status(400);
                return gson.toJson(Map.of("error", "Email parameter is missing"));
            }

            Institution institution = institutions.findByEmail(institutionalEmail).orElse(null);

            if (institution == null) {
                response.status(404);
                return gson.toJson(Map.of("error", "Institution not found"));
            }

            institutions.delete(institution);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Institution deleted successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return gson.toJson(Map.of("error", "An error occurred while deleting the institution"));
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetInstitutionHistory = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String institutionEmail = request.queryParams("email");
            if (institutionEmail == null || institutionEmail.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Email parameter is missing\"}";
            }

            List<Opportunity> opportunities = new Opportunities(entityManager).findByInstitutionalEmail(institutionEmail);

            // Transformar la lista de oportunidades a JSON
            String jsonOpportunities = gson.toJson(opportunities);

            // Renderizar el JSON en la respuesta
            response.type("application/json");
            return jsonOpportunities;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching institution history\"}";
        } finally {
            entityManager.close();
        }
    };

}

