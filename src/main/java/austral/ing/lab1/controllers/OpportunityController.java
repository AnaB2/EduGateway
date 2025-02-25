package austral.ing.lab1.controllers;

import austral.ing.lab1.TokenManager;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.repository.Opportunities;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.ArrayList;
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

public class OpportunityController {

    private static final Gson gson = new Gson();
    private static final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("test");

    public static Route handleAddOpportunity = (Request request, Response response) -> {
        // Obtener el token del encabezado de la solicitud
        String token = request.headers("Authorization");

        // Obtener los datos del usuario que realiza la solicitud
        String requestedUserEmail = request.headers("Email");

        // Verificar si el usuario está autorizado
        if (!TokenManager.isAuthorized(token, requestedUserEmail)) {
            response.status(401);
            return "{\"error\": \"Unauthorized\"}";
        }

        // Obtener los datos de la oportunidad del cuerpo de la solicitud
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        // Verificar que los campos requeridos no estén vacíos o en blanco
        if (formData.get("name").trim().isEmpty() || formData.get("category").trim().isEmpty() ||
                formData.get("city").trim().isEmpty() || formData.get("educationalLevel").trim().isEmpty() ||
                formData.get("modality").trim().isEmpty() || formData.get("language").trim().isEmpty() ||
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
            String modality = formData.get("modality");
            String language = formData.get("language");
            int capacity = Integer.parseInt(formData.get("capacity"));

            // Verificar que la capacidad no sea negativa
            if (capacity < 0) {
                response.status(400);
                return "{\"error\": \"Capacity cannot be negative\"}";
            }

            Opportunity opportunity = new Opportunity();
            opportunity.setName(name);
            opportunity.setCategory(category);
            opportunity.setCity(city);
            opportunity.setEducationalLevel(educationalLevel);
            opportunity.setModality(modality);
            opportunity.setLanguage(language);
            opportunity.setCapacity(capacity);

            opportunity.setInstitutionEmail(requestedUserEmail);

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
        // Obtener el nombre de la oportunidad a eliminar
        String requestBody = request.body();
        JsonObject jsonBody = JsonParser.parseString(requestBody).getAsJsonObject();
        String opportunityName = jsonBody.get("name").getAsString();

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            // Buscar la oportunidad por su nombre
            Opportunity opportunity = opportunities.findByName(opportunityName);

            if (opportunity == null) {
                response.status(404);
                return "{\"error\": \"Opportunity not found\"}";
            }

            // Eliminar la oportunidad
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

    public static Route handleEditOpportunity = (Request request, Response response) -> {
        // Obtener el nombre de la oportunidad a editar
        //String opportunityName = request.params(":name"); (lo incluí en el body)

        // Obtener los nuevos datos de la oportunidad del cuerpo de la solicitud
        String body = request.body();
        Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());

        // La busca por en nombre anterior, ya que actual puede haber cambiado.
        String opportunityName = formData.get("previousName");

        // Verificar que los campos requeridos no estén vacíos o en blanco
        if (formData.get("category").trim().isEmpty() ||
                formData.get("city").trim().isEmpty() || formData.get("educationalLevel").trim().isEmpty() ||
                formData.get("modality").trim().isEmpty() || formData.get("language").trim().isEmpty() ||
                formData.get("capacity").trim().isEmpty()) {
            response.status(400);
            return "{\"error\": \"Missing or empty fields\"}";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            // Buscar la oportunidad por su nombre
            Opportunity opportunity = opportunities.findByName(opportunityName);

            if (opportunity == null) {
                response.status(404);
                return "{\"error\": \"Opportunity not found\"}";
            }

            // Actualizar los datos de la oportunidad
            opportunity.setCategory(formData.get("category"));
            opportunity.setCity(formData.get("city"));
            opportunity.setEducationalLevel(formData.get("educationalLevel"));
            opportunity.setModality(formData.get("modality"));
            opportunity.setLanguage(formData.get("language"));
            opportunity.setCapacity(Integer.parseInt(formData.get("capacity")));

            // Persistir los cambios en la base de datos
            opportunities.persist(opportunity);

            tx.commit();
            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity updated successfully"));
        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            response.status(500);
            return "{\"error\": \"An error occurred while updating the opportunity\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetOpportunities = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            // Get page and size parameters from request, with default values
            int page = Integer.parseInt(request.queryParams("page") != null ? request.queryParams("page") : "1");
            int size = Integer.parseInt(request.queryParams("size") != null ? request.queryParams("size") : "10");

            if (page < 1 || size < 1) {
                response.status(400);
                return "{\"error\": \"Invalid pagination parameters\"}";
            }

            // Fetch paginated results
            List<Opportunity> opportunities = entityManager.createQuery("SELECT o FROM Opportunity o", Opportunity.class)
                    .setFirstResult((page - 1) * size)
                    .setMaxResults(size)
                    .getResultList();

            // Convert list to JSON
            String jsonOpportunities = gson.toJson(opportunities);

            // Render JSON response
            response.type("application/json");
            return jsonOpportunities;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching opportunities\"}";
        } finally {
            entityManager.close();
        }
    };

    public static Route handleGetOpportunitiesByEmail = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String userEmail = request.queryParams("email"); // Obtener el correo electrónico del parámetro de la solicitud
            if (userEmail == null || userEmail.isEmpty()) {
                response.status(400);
                return "{\"error\": \"Email parameter is missing\"}";
            }

            List<Opportunity> opportunities = new Opportunities(entityManager).findByInstitutionalEmail(userEmail);

            // Transformar la lista de oportunidades a JSON
            String jsonOpportunities = gson.toJson(opportunities);

            // Renderizar el JSON en la respuesta
            response.type("application/json");
            return jsonOpportunities;
        } catch (Exception e) {
            response.status(500);
            return "{\"error\": \"An error occurred while fetching opportunities by email\"}";
        } finally {
            entityManager.close();
        }
    };
}