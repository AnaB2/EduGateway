package austral.ing.lab1.controllers;

import austral.ing.lab1.TokenManager;
import spark.Request;
import spark.Response;
import spark.Route;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.EntityTransaction;
import austral.ing.lab1.model.User;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.repository.Opportunities;
import austral.ing.lab1.repository.Users;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.util.Map;
import java.util.List;
import java.util.Optional;

public class OpportunityController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleAddOpportunity = (Request request, Response response) -> {
        String token = request.headers("Authorization");
        String userEmail = request.headers("Email");

        if (!TokenManager.isAuthorized(token, userEmail)) {
            response.status(401);
            return "{\"error\": \"Unauthorized\"}";
        }

        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        if (formData.get("name").trim().isEmpty() || formData.get("category").trim().isEmpty() ||
                formData.get("city").trim().isEmpty() || formData.get("educationalLevel").trim().isEmpty() ||
                formData.get("deliveryMode").trim().isEmpty() || formData.get("language").trim().isEmpty() ||
                formData.get("capacity").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();

            String name = formData.get("name");
            String category = formData.get("category");
            String city = formData.get("city");
            String educationalLevel = formData.get("educationalLevel");
            String deliveryMode = formData.get("deliveryMode");
            String language = formData.get("language");
            int capacity = Integer.parseInt(formData.get("capacity"));

            Opportunity opportunity = new Opportunity();
            opportunity.setName(name);
            opportunity.setCategory(category);
            opportunity.setCity(city);
            opportunity.setEducationalLevel(educationalLevel);
            opportunity.setDeliveryMode(deliveryMode);
            opportunity.setLanguage(language);
            opportunity.setCapacity(capacity);
            opportunity.setInstitutionEmail(userEmail);

            opportunities.persist(opportunity);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity added successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while adding the opportunity\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleDeleteOpportunity = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        if (formData.get("name").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty name field\"}";
        }

        String opportunityName = formData.get("name");

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();

            Opportunity opportunity = opportunities.findByName(opportunityName);

            if (opportunity == null) {
                response.status(404);
                return "{\"error\": \"Opportunity not found\"}";
            }

            opportunities.delete(opportunity);
            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity deleted successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while deleting the opportunity\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleModifyOpportunity = (Request request, Response response) -> {
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        if (formData.get("name").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty name field\"}";
        }

        String opportunityName = formData.get("name");

        if (formData.get("category").trim().isEmpty() || formData.get("city").trim().isEmpty() ||
                formData.get("educationalLevel").trim().isEmpty() || formData.get("deliveryMode").trim().isEmpty() ||
                formData.get("language").trim().isEmpty() || formData.get("capacity").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        String category = formData.get("category");
        String city = formData.get("city");
        String educationalLevel = formData.get("educationalLevel");
        String deliveryMode = formData.get("deliveryMode");
        String language = formData.get("language");
        int capacity = Integer.parseInt(formData.get("capacity"));

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();

            Opportunity opportunity = opportunities.findByName(opportunityName);

            if (opportunity == null) {
                response.status(404);
                return "{\"error\": \"Opportunity not found\"}";
            }

            opportunity.setCategory(category);
            opportunity.setCity(city);
            opportunity.setEducationalLevel(educationalLevel);
            opportunity.setDeliveryMode(deliveryMode);
            opportunity.setLanguage(language);
            opportunity.setCapacity(capacity);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity modified successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while modifying the opportunity\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetOpportunities = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);

        List<Opportunity> allOpportunities = opportunities.listAll();

        response.type("application/json");
        return gson.toJson(allOpportunities);
    };
}
