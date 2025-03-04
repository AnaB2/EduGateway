package austral.ing.lab1.controllers;

import austral.ing.lab1.TokenManager;
import austral.ing.lab1.model.Opportunity;
import austral.ing.lab1.model.User;
import austral.ing.lab1.repository.Opportunities;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.util.*;
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
        Map<String, Object> formData = gson.fromJson(body, new TypeToken<Map<String, Object>>() {}.getType());

        // Mostrar los datos recibidos para depuración
        System.out.println("Datos recibidos en el request: " + formData);

        // Validación de campos requeridos
        if (!formData.containsKey("name") || !formData.containsKey("category") ||
                !formData.containsKey("city") || !formData.containsKey("educationalLevel") ||
                !formData.containsKey("modality") || !formData.containsKey("language") ||
                !formData.containsKey("capacity")) {
            response.status(400);
            return "{\"error\": \"Missing required fields\"}";
        }

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Opportunities opportunities = new Opportunities(entityManager);
        EntityTransaction tx = entityManager.getTransaction();

        try {
            tx.begin();

            String name = formData.get("name").toString();
            String category = formData.get("category").toString();
            String city = formData.get("city").toString();
            String educationalLevel = formData.get("educationalLevel").toString();
            String modality = formData.get("modality").toString();
            String language = formData.get("language").toString();

            // ✅ Fix: Handle `capacity` correctly (handles both 50 and 50.0)
            Object capacityObj = formData.get("capacity");
            int capacity;
            if (capacityObj instanceof Number) {
                capacity = ((Number) capacityObj).intValue(); // Converts Integer or Double safely
            } else {
                capacity = Integer.parseInt(capacityObj.toString().split("\\.")[0]); // Removes decimals
            }

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

            // ✅ Fix: Handle `tags` field correctly to prevent ClassCastException
            Set<String> tagsSet = new HashSet<>();
            if (formData.containsKey("tags")) {
                Object tagsObject = formData.get("tags");

                // Debugging logs
                System.out.println("Tags received: " + tagsObject);
                System.out.println("Tags class: " + tagsObject.getClass().getName());

                if (tagsObject instanceof List<?>) {
                    List<?> tagsList = (List<?>) tagsObject;
                    for (Object tag : tagsList) {
                        if (tag instanceof String) {
                            tagsSet.add((String) tag);
                        } else {
                            System.out.println("Invalid tag type: " + tag.getClass().getName());
                        }
                    }
                } else {
                    System.out.println("Tags are not a List: " + tagsObject.getClass().getName());
                }
            }
            opportunity.setTags(tagsSet);

            opportunities.persist(opportunity);
            tx.commit();

            response.type("application/json");
            return gson.toJson(Map.of("message", "Opportunity added successfully"));

        } catch (Exception e) {
            if (tx.isActive()) {
                tx.rollback();
            }
            e.printStackTrace(); // Mostrar el error en la terminal para depuración
            response.status(500);
            return "{\"error\": \"An error occurred: " + e.getMessage() + "\"}";
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
            e.printStackTrace();
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

    public static Route getRecommendedOpportunities = (Request request, Response response) -> {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        try {
            String userIdParam = request.queryParams("userId");
            if (userIdParam == null || userIdParam.trim().isEmpty()) {
                response.status(400);
                return "{\"error\": \"Missing user ID\"}";
            }

            Long userId;
            try {
                userId = Long.parseLong(userIdParam);
            } catch (NumberFormatException e) {
                response.status(400);
                return "{\"error\": \"Invalid user ID format\"}";
            }

            User user = entityManager.find(User.class, userId);
            if (user == null) {
                response.status(404);
                return "{\"error\": \"User not found\"}";
            }

            Set<String> preferredTags = user.getPreferredTags();
            if (preferredTags.isEmpty()) {
                response.status(200);
                return gson.toJson(Collections.emptyList());
            }

            // ✅ Verificar si las oportunidades tienen tags en común con el usuario
            List<Opportunity> recommendedOpportunities = entityManager.createQuery(
                            "SELECT DISTINCT o FROM Opportunity o JOIN o.tags tag WHERE tag IN :preferredTags", Opportunity.class)
                    .setParameter("preferredTags", preferredTags)
                    .getResultList();

            response.type("application/json");
            return gson.toJson(recommendedOpportunities);

        } catch (Exception e) {
            e.printStackTrace();  // ✅ Imprime el error en la consola del backend
            response.status(500);
            return "{\"error\": \"An error occurred while fetching recommendations\"}";
        } finally {
            entityManager.close();
        }
    };
}